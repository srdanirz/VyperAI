import {useState, useEffect, memo} from "react";
import axios from "axios";
import BasicChips from "../components/BasicChips";
import Button from "../components/Button";
import Status from "../components/Status";
import Toaster from "../components/Toaster"; 
import HomeHeader from "../components/HomeHeader"; 
import { useNavigate } from "react-router-dom";
import {
  deleteIcon,
  queueIcon,
} from "../utils/Images";
import DropdownMenu from "../components/Menu";
import { CopyIconcolor } from "../components/Status";
import toast from "react-hot-toast";
import {useAtom} from "jotai";
import {licenseAtom, tasksAtom} from "../state/jotai";
import useTasks from "../hooks/useTasks";
import {useSelector} from "react-redux";
import {getGroupList} from "../selector";
import {vyperproxies} from "../assets/vyper";
import {FadeLoader} from "react-spinners";
import {ArrowDownIcon} from "@heroicons/react/24/solid";
import InfiniteScroll from 'react-infinite-scroll-component';

const TableRow = memo(({ task, handleDeleteRow, currentProfile, selectedProxy }) => {
  return (
    <tr
      key={task.id}
      className="bg-[#1B1B26] items-center place-items-start rounded-[10px] grid-cols-7 font-thin"
    >
      <td className="py-2 w-[100px] text-center">{task.taskNumber}</td>
      <td className="text-left w-[200px] px-4">{task.store}</td>
      <td className="text-left w-[200px] px-4">{task.event}</td>
      <td className="text-left w-[150px] px-4">
        {task.queueNumber === '-' ? <div className={'text-blue-400'}>-</div> : task.queueNumber}
      </td>
      <td className="text-center w-[150px] px-4">
        <div className="truncate max-w-[140px] mx-auto" title={currentProfile || selectedProxy?.name || 'Vyper Proxies'}>
          {currentProfile || selectedProxy?.name || 'Vyper Proxies'}
        </div>
      </td>
      <td className="text-center w-[150px] px-4">
        <div className="flex items-center justify-center">
          <Status statusType={task.status}/>
        </div>
      </td>
      <td className="text-center w-[120px] px-4">
        <div className={'flex items-center justify-center gap-3'}>
          <CopyIconcolor 
            statusType={task.status}
            linkToCopy={task.Link}
            taskId={task.taskNumber}
          />
          <button 
            onClick={() => handleDeleteRow(task.taskNumber)} 
            className="p-1.5 hover:bg-[#2A2A40] rounded-md transition-all duration-300"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="#ff3856" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
});

const Home = () => {
  useTasks();

  const [tasks, setTasks] = useAtom(tasksAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortDesc, setSortDesc] = useState(false);
  const [licenseData, setLicenseData] = useAtom(licenseAtom);
  const [product, setProduct] = useState(null);
  const [showToaster, setShowToaster] = useState(false);
  const navigate = useNavigate();
  const [showTasks, setShowTasks] = useState(15);
  const [queueLink, setQueueLink] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingg, setIsDeletingg] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("Vyper Proxies");
  const [currentProfile, setCurrentProfile] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 200;
  const grouplist = useSelector(getGroupList);

  const getRandomProxies = (proxyList, count) => {
    const shuffled = [...proxyList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const toastStyle = {
    success: {
      duration: 1000,
      position: 'top-center', // Cambiado a top-center
      style: {
        background: '#14141F',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #38ff9b',
        maxWidth: '400px',
        textAlign: 'center',
        margin: '0 auto'
      }
    },
    error: {
      duration: 1000,
      position: 'top-center', // Cambiado a top-center
      style: {
        background: '#14141F',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #FF0B0B',
        maxWidth: '400px',
        textAlign: 'center',
        margin: '0 auto'
      }
    },
    loading: {
      duration: 1000,
      position: 'top-center', // Cambiado a top-center
      style: {
        background: '#14141F',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #8074E0',
        maxWidth: '400px',
        textAlign: 'center',
        margin: '0 auto'
      }
    }
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      // Función auxiliar para extraer el valor numérico
      const extractNumericValue = (queueNumber) => {
        // Si es undefined o null, tratar como '-'
        if (!queueNumber) return sortDesc ? -1 : 9999999999;
  
        // Si es '-', manejar según el orden
        if (queueNumber === '-') return sortDesc ? -1 : 9999999999;
  
        // Si es un porcentaje
        if (typeof queueNumber === 'string' && queueNumber.endsWith('%')) {
          const percentage = parseFloat(queueNumber);
          if (!isNaN(percentage)) {
            // Para porcentajes, mantener la lógica consistente con el ordenamiento
            return percentage;
          }
          return sortDesc ? -1 : 9999999999;
        }
  
        // Si es un número normal
        const number = parseInt(queueNumber);
        if (!isNaN(number)) {
          return number;
        }
  
        return sortDesc ? -1 : 9999999999;
      };
  
      const aValue = extractNumericValue(a.queueNumber);
      const bValue = extractNumericValue(b.queueNumber);
  
      // Aplicar el orden según sortDesc
      return sortDesc ? bValue - aValue : aValue - bValue;
    });
  };

  // Obtener todas las tareas ordenadas primero
  const allSortedTasks = getSortedTasks();
  const totalPages = Math.ceil(allSortedTasks.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allSortedTasks.slice(indexOfFirstRow, indexOfLastRow);

  const selectedProxy = [...grouplist, {
    name: 'Vyper Proxies',
    proxies: vyperproxies
  }].find(y => y.name.toLowerCase() === selectedProfile.toLowerCase());

  useEffect(() => {
    const run = async () => {
      setQueueLink(await window.api.queueLink.get());
    };
    run();
  }, []);

  useEffect(() => {
    if (licenseData.product) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(
            `https://api.whop.com/v2/products/${licenseData.product}`,
            {
              headers: {
                Authorization: "Bearer p1UA4RWjHUMO-_1S5E9ksiQLxmKzTDTtZ4gj1Rgjf7s",
              },
            },
          );
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching the product data:", error);
        }
      };

      fetchProductData();
    }
  }, [licenseData.product]);

  if (!product) {
    return <div className="absolute left-0 right-0 top-10 bottom-0 flex justify-center items-center bg-[#14141F]">
      <FadeLoader color="#38ff9b"/>
    </div>;
  }
  const handleDeleteAllRows = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    setSubmit(true);
    
    try {
      // Mostrar toast de carga
      toast.loading('Eliminando tasks...', {
        ...toastStyle.loading,
        id: 'delete-all'  // ID único para este toast
      });
  
      const res = await window.api.tasks.delete();
      
      // Remover toast de carga y mostrar éxito
      toast.dismiss('delete-all');
      toast.success('Tasks detenidas y eliminadas', toastStyle.success);
      
      // Limpiar estado
      setTasks([]);
      localStorage.removeItem('copiedLinks');  // También limpiamos el localStorage
      
    } catch (err) {
      // Remover toast de carga y mostrar error
      toast.dismiss('delete-all');
      console.error('Error al eliminar tasks:', err);
      toast.error('Error al eliminar tasks', toastStyle.error);
    } finally {
      setSubmit(false);
      setIsDeleting(false);
    }
  };
  
const handleRefresh = async () => {
  setSubmit(true);
  const taskCount = licenseData.taskCount;

  if (!selectedProxy) {
    setSubmit(false);
    return toast.error('No proxy seleccionado', toastStyle.error);
  }
  if (!queueLink) {
    setSubmit(false);
    return toast.error('No link de fila ingresado', toastStyle.error);
  }
  
    localStorage.removeItem('copiedLinks');
  
    let proxiesToUse;
  
    if (selectedProxy.name.toLowerCase() === 'vyper proxies') {
      if (vyperproxies.length < taskCount) {
        setSubmit(false);
        return toast.error(`No hay suficientes proxies Vyper disponibles para ${taskCount} tareas`);
      }
      proxiesToUse = getRandomProxies(vyperproxies, taskCount);
    } else {
      if (selectedProxy.proxies.length < taskCount) {
        setSubmit(false);
        return toast.error(`No hay suficientes proxies en ${selectedProxy.name} para ${taskCount} tareas`);
      }
      proxiesToUse = selectedProxy.proxies.slice(0, taskCount);
    }
  
    try {
      await window.api.tasks.delete();
      await window.api.tasks.start({
        "taskCount": taskCount,
        "proxies": proxiesToUse,
        "queueUrl": queueLink
      });
      toast.success('Tasks reiniciadas', toastStyle.success);
    } catch (error) {
      console.error('Error al reiniciar tasks:', error);
      toast.error('No se pudo reiniciar las tasks!', toastStyle.error);
    } finally {
      setSubmit(false);
    }
  };
  
  const handleRunTask = async () => {
    if (!selectedProxy) {
      return toast.error('No proxy seleccionado', toastStyle.error);
    }
    if (!queueLink) {
      return toast.error('No link de fila ingresado', toastStyle.error);
    }
  
    setSubmit(true);
    localStorage.removeItem('copiedLinks');
  
    let proxiesToUse;
    const taskCount = licenseData.taskCount;
    
    // Validar que tenemos un nombre de proxy válido
    const proxyName = selectedProxy.name || 'Vyper Proxies';
  
    if (proxyName.toLowerCase() === 'vyper proxies') {
      if (vyperproxies.length < taskCount) {
        toast.error(`No hay suficientes proxies Vyper disponibles para ${taskCount} tareas`, toastStyle.error);
        setSubmit(false);
        return;
      }
      proxiesToUse = getRandomProxies(vyperproxies, taskCount);
    } else {
      if (!selectedProxy.proxies || selectedProxy.proxies.length < taskCount) {
        toast.error(`No hay suficientes proxies en ${proxyName} para ${taskCount} tareas`, toastStyle.error);
        setSubmit(false);
        return;
      }
      proxiesToUse = selectedProxy.proxies.slice(0, taskCount);
    }
  
    try {
      const res = await window.api.tasks.start({
        "taskCount": taskCount,
        "proxies": proxiesToUse,
        "queueUrl": queueLink
      });
  
      // Actualizar el perfil actual con el nombre correcto del proxy
      setCurrentProfile(proxyName);
      toast.success('Tasks iniciadas', toastStyle.success);
    } catch (error) {
      console.error('Error al iniciar tasks:', error);
      toast.error('No se pudo iniciar tasks!', toastStyle.error);
    } finally {
      setSubmit(false);
    }
  };
  
  const handleArchiveTasks = async () => {
    try {
      const success = await window.api.tasks.archiveTasks(tasks);
      if (success) {
        toast.success('Tasks archived successfully', toastStyle.success);
      }
    } catch (error) {
      toast.error('Error archiving tasks', toastStyle.error);
    }
  };
  
  const handleStopTask = async () => {
    if (isStopping) return;
    
    setIsStopping(true);
    setSubmit(true);
  
    try {
      // Mostrar toast de carga
      toast.loading('Deteniendo tasks...', {
        ...toastStyle.loading,
        id: 'stop-tasks'  // ID único para este toast
      });
  
      const res = await window.api.tasks.stop();
  
      // Remover toast de carga y mostrar éxito
      toast.dismiss('stop-tasks');
      toast.success('Tasks detenidas', toastStyle.success);
      
    } catch (error) {
      // Remover toast de carga y mostrar error
      toast.dismiss('stop-tasks');
      console.error('Error al detener tasks:', error);
      toast.error('Error al detener tasks', toastStyle.error);
    } finally {
      setSubmit(false);
      setIsStopping(false);
    }
  };
  
  const handleDeleteRow = async (taskId) => {
    if (isDeletingg) return;
    
    setIsDeletingg(true);
    setSubmit(true);
    
    try {
      // Mostrar toast de carga
      toast.loading('Eliminando task...', {
        ...toastStyle.loading,
        id: `delete-task-${taskId}`  // ID único para cada task
      });
  
      const res = await window.api.tasks.deleteOne(parseInt(taskId));
      
      if (!res) {
        throw new Error('No se recibió respuesta del servidor');
      }
  
      // Remover toast de carga
      toast.dismiss(`delete-task-${taskId}`);
  
      if (res.success) {
        setTasks(prevTasks => prevTasks.filter(task => task.taskNumber !== taskId));
        toast.success('Task eliminada exitosamente', toastStyle.success);
      } else {
        toast.error(res.message || 'Error al eliminar la task', toastStyle.error);
      }
      
    } catch (err) {
      // Remover toast de carga y mostrar error
      toast.dismiss(`delete-task-${taskId}`);
      console.error('Error al eliminar task:', err);
      toast.error(err.message || 'Error al eliminar la task', toastStyle.error);
    } finally {
      setSubmit(false);
      setIsDeletingg(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      running: tasks.length,
      processing: 0,
      success: 0,
      failed: 0
    };
  
    const statusGroups = {
      processing: [
        "Iniciando...",
        "Creando sesión...",
        "Procesando...",
        "Resolviendo...",
        "Verificando...",
        "Entrando...",
        "Monitoreando...",
        "Recuperando...",
        "Reintentando...",
        "Deteniendo..."
      ],
      success: [
        "Completado",
        "Acceso conseguido",
        "Monitoreando..."
      ],
      failed: [
        "Fallido",
        "Proxy fallido",
        "Detenido",
        "Evento terminado"
      ]
    };
  
    tasks.forEach(task => {
      if (statusGroups.processing.includes(task.status)) {
        counts.processing++;
      } else if (statusGroups.success.includes(task.status)) {
        counts.success++;
      } else if (statusGroups.failed.includes(task.status)) {
        counts.failed++;
      }
    });
  
    return counts;
  };

  const { Solving, Successful, failed, calculating } = getStatusCounts();

  const filteredTasks = tasks.filter(
    (task) =>
      task.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.proxy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.queueNo.toString().includes(searchQuery),
  );

  const sortedTasks = filteredTasks.slice();


  const toggleSortOrder = () => {
    // Function to toggle between ascending and descending order
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const columns = [
    "Task",
    "Store",
    "Evento",
    <span key="queue" className="flex items-cente gap-2 cursor-pointer" onClick={() => setSortDesc(e => !e)}>
      Número de fila
      <ArrowDownIcon 
    style={{rotate: sortDesc ? '0deg': '180deg'}}
    width={'18px'} 
    height={'18px'} 
    className={'mt-0.5 transition-transform'}
  />
    </span>,
  ];


  return (
    <div className="h-full pb-20 pt-3 p-8 font-Jakarta600 min-w-fit">
      <Toaster
        variant="error"
        message="Tu plan ha expirado. Por favor compra un nuevo plan"
        show={showToaster && !licenseData.valid}
      />
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl pl-1 font-bold font-Jakarta700">{product.name}</h1>
        {(totalPages > 1 || tasks.length > 0) && (
          <div className="flex items-center gap-1.5">
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="h-[40px] px-3 bg-[#1B1B26] text-white rounded-[10px] 
            font-Jakarta600 text-sm flex items-center justify-center min-w-[90px] 
            hover:bg-[#2A2A40] disabled:opacity-50 disabled:cursor-not-allowed 
            transition-all duration-300 ease-in-out"
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <div className="h-[40px] px-3 bg-[#1B1B26] rounded-[10px] font-Jakarta600 text-sm
                  flex items-center justify-center min-w-[120px]
                  text-white">
                  Página {currentPage} de {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="h-[40px] px-3 bg-[#1B1B26] text-white rounded-[10px] 
            font-Jakarta600 text-sm flex items-center justify-center min-w-[90px] 
            hover:bg-[#2A2A40] disabled:opacity-50 disabled:cursor-not-allowed 
            transition-all duration-300 ease-in-out"
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </>
            )}
            {tasks.length > 0 && (
              <button
                onClick={handleArchiveTasks} 
                className="flex items-center gap-2 h-[40px] px-3 
            bg-[#1B1B26] text-white rounded-[10px] 
            font-Jakarta600 text-sm hover:bg-[#2A2A40]
            transition-all duration-300"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-[#38ff9b]"
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Archivar
              </button>
            )}
          </div>
        )}
      </div>
  
      <div className="h-full p-[1px] rounded-[9px] inset-0 bg-gradient-to-r from-white via-[#38ff9b] to-[#38ff9b] animate-gradient">
        <div className="bg-[#14141F] rounded-[9px] p-8 overflow-y-hidden h-full">
          <header className="flex items-center justify-between w-full min-w-fit gap-6">
            <div className="flex gap-2 min-w-[250px]">
              <BasicChips color={"default"} text={getStatusCounts().running.toString()} />
              <BasicChips color={"warning"} text={getStatusCounts().processing.toString()} />
              <BasicChips color={"success"} text={getStatusCounts().success.toString()} />
              <BasicChips color={"failed"} text={getStatusCounts().failed.toString()} />
            </div>
  
            <div className="flex items-center bg-[#1B1B26] rounded-[10px] px-3 h-[40px] min-w-[150px] w-full max-w-[550px]">
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-[#38ff9b] flex-shrink-0"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="bg-transparent p-3 w-full h-[40px] outline-none font-Jakarta500 font-medium"
                placeholder="Ingresar link de la fila"
                value={queueLink}
                onChange={(e) => {
                  setQueueLink(e.target.value)
                  window.api.queueLink.set(e.target.value)
                }}
              />
            </div>
  
            <div className="flex gap-2 min-w-fit">
              <DropdownMenu 
                selectedProfile={selectedProfile} 
                setSelectedProfile={setSelectedProfile}
                className="h-[40px] min-w-[120px] bg-[#1B1B26] rounded-[10px] 
                          border border-transparent hover:border-[#38ff9b] transition-all duration-300
                          text-[#9A9AB6]"
              />
              <div className={`flex items-center gap-2 ${submit ? 'opacity-60 pointer-events-none' : ''}`}>
                {/* Delete Button */}
                <button
                  className={`flex gap-2 min-w-[120px] h-[40px] items-center justify-center 
                             rounded-[10px] transition-all duration-300 
                             bg-[#1B1B26] hover:bg-[#2A2A40] group
                             ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleDeleteAllRows}
                  disabled={isDeleting}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-[#ff3856]"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  <span className="text-white group-hover:text-white">Delete</span>
                </button>

                {/* Run Button */}
                <button
                  onClick={() => handleRunTask(null)}
                  className="flex gap-2 min-w-[120px] h-[40px] items-center justify-center 
                            rounded-[10px] transition-all duration-300 
                            bg-[#38ff9b] hover:bg-[#57ffb3] group"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="white"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span className="text-white group-hover:text-white">Run</span>
                </button>

                {/* Stop Button */}
                <button
                  onClick={() => handleStopTask(null)}
                  className="flex gap-2 min-w-[120px] h-[40px] items-center justify-center 
                            rounded-[10px] transition-all duration-300 
                            bg-[#ff3856] hover:bg-[#ff6f7d] group"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="white"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                  <span className="text-white group-hover:text-white">Stop</span>
                </button>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  className="w-[40px] h-[40px] flex items-center justify-center 
                            rounded-[10px] transition-all duration-300 
                            bg-[#1B1B26] hover:bg-[#2A2A40] group"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-[#38ff9b] group-hover:text-[#38ff9b] transition-colors duration-300"
                  >
                    <path d="M21 2v6h-6" />
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                    <path d="M3 22v-6h6" />
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>
  
          <div className="flex-1 min-h-0 overflow-hidden mt-4">
            <div className="h-[calc(100vh-220px)] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#2D2D3A] scrollbar-track-transparent">
              <table className="w-full font-Jakarta600 font-semibold min-w-fit">
                <thead className="text-left sticky top-0 bg-[#14141F] z-10">
                  <tr className="pb-4">
                    <th className="py-2 px-4 w-[100px] text-center whitespace-nowrap">Task</th>
                    <th className="py-2 px-4 w-[200px] text-left whitespace-nowrap">Store</th>
                    <th className="py-2 px-4 w-[200px] text-left whitespace-nowrap">Evento</th>
                    <th className="py-2 px-4 w-[150px] text-left whitespace-nowrap cursor-pointer" onClick={() => setSortDesc(prev => !prev)}>
                      <div className="flex items-center gap-2">
                        Número de fila
                        <ArrowDownIcon 
                          style={{rotate: sortDesc ? '0deg': '180deg'}}
                          width={'18px'} 
                          height={'18px'} 
                          className={'mt-0.5 transition-transform'}
                        />
                      </div>
                    </th>
                    <th className="py-2 px-4 w-[150px] text-center whitespace-nowrap">Proxy</th>
                    <th className="py-2 px-4 w-[200px] text-center whitespace-nowrap">Estado</th>
                    <th className="py-2 px-4 w-[120px] text-center whitespace-nowrap">Link</th>
                  </tr>
                </thead>
                <tbody className="gap-2 text-sm">
                  {currentRows.map((task) => (
                    <TableRow
                      key={task.taskNumber}
                      task={task}
                      handleDeleteRow={handleDeleteRow}
                      currentProfile={currentProfile}
                      selectedProxy={selectedProxy}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
