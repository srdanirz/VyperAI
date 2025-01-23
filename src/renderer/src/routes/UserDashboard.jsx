import React, { useCallback } from 'react';
import { useAtom } from "jotai";
import { licenseAtom } from "../state/jotai";
import axios from "axios";
import { useState, useEffect } from "react";
import { FadeLoader } from "react-spinners";
import { Camera, Upload, Settings, Shield, Key, Calendar, ExternalLink, BarChart } from 'lucide-react';
import toast from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const [licenseData] = useAtom(licenseAtom);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membershipDetails, setMembershipDetails] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLicenseVisible, setIsLicenseVisible] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isUsernameVisible, setIsUsernameVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [customAvatar, setCustomAvatar] = useState(localStorage.getItem('customAvatar'));
  const [brightDataUsage, setBrightDataUsage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (licenseData?.product) {
        try {
          const [productResponse, membershipResponse] = await Promise.all([
            axios.get(`https://api.whop.com/v2/products/${licenseData.product}`, {
              headers: {
                Authorization: "Bearer p1UA4RWjHUMO-_1S5E9ksiQLxmKzTDTtZ4gj1Rgjf7s",
              },
            }),
            axios.get(`https://api.whop.com/v2/memberships/${licenseData.license_key}`, {
              headers: {
                Authorization: "Bearer p1UA4RWjHUMO-_1S5E9ksiQLxmKzTDTtZ4gj1Rgjf7s",
              },
            })
          ]);
  
          setProduct(productResponse.data);
          setMembershipDetails(membershipResponse.data);
  
          try {
            const brightDataData = await window.api.getBrightDataUsage();
            setBrightDataUsage(brightDataData);
          } catch (brightDataError) {
            console.error("Error detallado de BrightData:", brightDataError);
            toast.error("Error al cargar datos de uso de proxies");
          }
  
        } catch (error) {
          console.error("Error fetching Whop data:", error);
          toast.error("Error al cargar datos de suscripción");
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  }, [licenseData]);

  useEffect(() => {
    const handleWebSocketStatus = (event, data) => {
      setIsConnected(data.connected);
    };
  
    window.api.onWebSocketStatus(handleWebSocketStatus);
  
    // Limpieza del listener al desmontar
    return () => {
      window.api.clearListeners('websocket-status');
    };
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('customAvatar', reader.result);
        setCustomAvatar(reader.result);
        window.dispatchEvent(new Event('avatarUpdate'));
        toast.success('Imagen de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const useWhopAvatar = () => {
    localStorage.removeItem('customAvatar');
    setCustomAvatar(null);
    window.dispatchEvent(new Event('avatarUpdate'));
    toast.success('Usando avatar de Whop');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExternalLink = async (url) => {
    try {
      const success = await window.api.openExternal(url);
      if (!success) {
        console.error('No se pudo abrir el enlace');
      }
    } catch (error) {
      console.error('Error al abrir el enlace:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  // Y ajustar la función processDataForChart
  const processDataForChart = (data) => {
    try {
      if (!data?.hl_849bcaf6?.data?.datacenter_proxy1?.bw_sum) {
        return [];
      }
      
      const datacenterData = data.hl_849bcaf6.data.datacenter_proxy1.bw_sum;
      const today = new Date();
      
      return datacenterData.map((value, index) => {
        const date = new Date();
        // Ajustar la fecha para cada punto de datos, empezando desde el día más antiguo
        date.setDate(today.getDate() - (datacenterData.length - 1 - index));
        
        return {
          name: date.toLocaleDateString('es-ES', { 
            day: 'numeric',
            month: 'short'
          }),
          datacenter: value || 0,
          fullDate: date // Guardamos la fecha completa para el tooltip
        };
      });
    } catch (error) {
      console.error("Error procesando datos:", error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="absolute left-0 right-0 top-10 bottom-0 flex justify-center items-center bg-[#14141F]">
        <FadeLoader color="#38ff9b" />
      </div>
    );
  }

  const getStatusColor = (days) => {
    if (!days) return 'text-[#38ff9b]';
    if (days < 3) return 'text-orange-500';
    if (days < 7) return 'text-yellow-500';
    return 'text-[#38ff9b]';
  };

  return (
    <div className="min-h-screen pb-12 pt-3 px-8 font-Jakarta600">
      <div className="pl-1 mb-4">
        <h1 className="text-2xl font-bold font-Jakarta700">Perfil de Usuario</h1>
      </div>

      <div className="h-[670px] p-[1px] rounded-[9px] bg-gradient-to-r from-white via-[#38ff9b] to-[#38ff9b] animate-gradient">
        <div className="bg-[#14141F] h-full rounded-[9px] p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
            {/* Primera columna */}
            <div className="flex flex-col gap-5 h-full">
              {/* Detalles de Suscripción - 35% de altura */}
              <div className="bg-[#1B1B26] p-5 rounded-lg h-[40%]">
                <h2 className="text-xl font-Jakarta700 text-[#38ff9b] mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Detalles de Suscripción
                </h2>
                <div className="space-y-2.5">
                  {/* Plan y Estado */}
                  <div className="bg-[#2A2A40] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Plan Actual</p>
                    <p className="font-Jakarta600 text-base mt-0.5">{product?.name}</p>
                  </div>

                 {/* Progreso y Días Restantes */}
                  <div className="bg-[#2A2A40] p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">El plan se renueva en</p>
                        {(() => {
                          const currentTime = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
                          const renewalPeriodEnd = membershipDetails?.renewal_period_end; // Timestamp de fin

                          let daysRemaining = '∞'; // Valor predeterminado
                          if (renewalPeriodEnd) {
                            const remainingTime = renewalPeriodEnd - currentTime; // Tiempo restante en segundos
                            if (remainingTime > 0) { // Asegúrate de que el tiempo restante sea positivo
                              daysRemaining = Math.max(0, Math.floor(remainingTime / (60 * 60 * 24))); // Convertir a días
                            } else {
                              daysRemaining = 0; 
                            }
                          }

                          return (
                            <p className={`text-lg font-Jakarta700 mt-0.5 ${getStatusColor(daysRemaining)}`}>
                              {daysRemaining} días
                            </p>
                          );
                        })()}
                      </div>
                      <div className="w-12 h-12 rounded-full border-4 border-[#38ff9b] flex items-center justify-center">
                        {(() => {
                          const currentTime = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
                          const renewalPeriodEnd = membershipDetails?.renewal_period_end; // Timestamp de fin
                          let remainingPercentage = 30; // Valor predeterminado

                          if (renewalPeriodEnd) {
                            const remainingTime = renewalPeriodEnd - currentTime; // Tiempo restante en segundos
                            const daysRemaining = Math.max(0, Math.floor(remainingTime / (60 * 60 * 24))); // Convertir a días
                            remainingPercentage = Math.min(100, Math.round((daysRemaining || 30) / 30 * 100));
                          }

                          return (
                            <span className="text-[#38ff9b] font-Jakarta700 text-xs">
                              {remainingPercentage}%
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Personal - 65% de altura */}
              <div className="bg-[#1B1B26] p-5 rounded-lg h-[65%]">
                <h2 className="text-xl font-Jakarta700 text-[#38ff9b] mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Información Personal
                </h2>
                <div className="space-y-4">
                <div className="bg-[#2A2A40] p-3.5 rounded-lg">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p 
                    className="font-Jakarta600 mt-1 cursor-pointer relative inline-block"
                    onClick={() => setIsEmailVisible(!isEmailVisible)}
                  >
                    <span className="select-none">
                      {licenseData.email}
                    </span>
                    <div className={`absolute -inset-x-[1px] -inset-y-[0.5px] bg-[#1B1B26] rounded-xl transition-opacity duration-200 ${isEmailVisible ? 'opacity-0' : 'opacity-100'}`} />
                  </p>
                </div>

                <div className="bg-[#2A2A40] p-3.5 rounded-lg">
                  <p className="text-gray-400 text-sm">Usuario</p>
                  <p 
                    className="font-Jakarta600 mt-1 cursor-pointer relative inline-block"
                    onClick={() => setIsUsernameVisible(!isUsernameVisible)}
                  >
                    <span className="select-none">
                      {licenseData.email.split('@')[0]}
                    </span>
                    <div className={`absolute -inset-x-[1px] -inset-y-[0.5px] bg-[#1B1B26] rounded-xl transition-opacity duration-200 ${isUsernameVisible ? 'opacity-0' : 'opacity-100'}`} />
                  </p>
                </div>

                <div className="bg-[#2A2A40] p-3.5 rounded-lg flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Clave de licencia (License Key)</p>
                    <p 
                      className="font-Jakarta600 break-all pr-3 mt-1 cursor-pointer relative inline-block"
                      onClick={() => setIsLicenseVisible(!isLicenseVisible)}
                    >
                      <span className="select-none">
                        {licenseData.license_key}
                      </span>
                      <div className={`absolute -inset-x-[1px] -inset-y-[0.5px] bg-[#1B1B26] rounded-xl transition-opacity duration-200 ${isLicenseVisible ? 'opacity-0' : 'opacity-100'}`} />
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(licenseData.license_key);
                      toast.success('License key copiada');
                    }}
                    className="text-[#38ff9b] hover:text-[#38ff9b]/80 transition-colors flex-shrink-0"
                  >
                    <Key size={18} />
                  </button>
                </div>
                </div>
              </div>
            </div>

            {/* Segunda columna */}
            <div className="flex flex-col gap-5 h-full">
              {/* Sección de Avatar - 37% de altura */}
              <div className="bg-[#1B1B26] p-5 rounded-lg h-[40%]">
                <h2 className="text-xl font-Jakarta700 text-[#38ff9b] mb-3 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Foto de Perfil
                </h2>
                <div className="flex items-center justify-between h-[calc(100%-40px)]">
                  <div 
                    className="relative group"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {customAvatar ? (
                      <img 
                        src={customAvatar}
                        alt="Custom Profile" 
                        className="w-24 h-24 rounded-full border-4 border-[#38ff9b] object-cover"
                      />
                    ) : licenseData.avatar_url ? (
                      <img 
                        src={licenseData.avatar_url}
                        alt="Whop Profile" 
                        className="w-24 h-24 rounded-full border-4 border-[#38ff9b] object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#2A2A40] flex items-center justify-center border-4 border-[#38ff9b]">
                        <span className="text-3xl text-[#38ff9b]">
                          {licenseData.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className={`absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Camera className="w-6 h-6 text-white hover:text-[#38ff9b] transition-colors" />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 ml-4">
                    <button
                      onClick={() => document.querySelector('input[type="file"]').click()}
                      className="w-full bg-[#2A2A40] hover:bg-[#3A3A50] text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      Subir Nueva Foto
                    </button>
                    {customAvatar && (
                      <button
                        onClick={useWhopAvatar}
                        className="w-full bg-[#2A2A40] hover:bg-[#3A3A50] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Usar Avatar de Whop
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#1B1B26] p-5 rounded-lg h-[65%]">
                <h2 className="text-xl font-Jakarta700 text-[#38ff9b] mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  <span>Uso de Vyper Proxies (Global)</span>
                  <div className="flex items-center">
                    <span className="relative flex h-2 w-2">
                      {isConnected ? (
                        <>
                          <span className="animate-slow-ping absolute inline-flex h-full w-full rounded-full bg-[#38ff9b] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38ff9b]"></span>
                        </>
                      ) : (
                        <>
                          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </>
                      )}
                    </span>
                  </div>
                </h2>
                <div className="w-full h-[calc(100%-48px)]">
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processDataForChart(brightDataUsage)}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9A9AB6"
                      style={{fontSize: '11px'}}
                    />
                    <YAxis 
                      stroke="#9A9AB6"
                      style={{fontSize: '11px'}}
                      tickFormatter={formatBytes}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#2A2A40',
                        border: '1px solid #3A3A50',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      labelFormatter={(_, { payload }) => {
                        if (payload && payload[0] && payload[0].payload.fullDate) {
                          return payload[0].payload.fullDate.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          });
                        }
                        return '';
                      }}
                      formatter={(value) => [`${formatBytes(value)}`, 'Uso']}
                      labelStyle={{color: '#9A9AB6'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="datacenter" 
                      stroke="#38ff9b" 
                      strokeWidth={2}
                      dot={false}
                      name="Datacenter"
                    />
                  </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;