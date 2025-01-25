import { useState, useEffect, useRef } from 'react';
import { Dialog } from "../components/ui/Dialog";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { 
  GitBranch,
  Upload, 
  Download,
  Edit2,
  Trash2,
  Plus,
  Search,
  RefreshCw
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { getActiveGroup, getGroupList } from "../selector";
import {
  addGroup,
  deleteGroup,
  initActiveGroup,
  updateGroup,
} from "../features/appSlice";
import {
  getId,
  parseProxiesArray,
  proxiesArrayToStr,
  proxiesStrToArray,
} from "../utils";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";

const columns = ["Task", "Proxy", "Username", "Password", "Action"];

const Proxy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [createGroupState, setCreateGroupState] = useState();
  const [isOpenGroupModal, setIsOpenGroupModal] = useState(false);
  const [isDeleteGroupShow, setIsDeleteGroupShow] = useState(false);
  const [isEditGroupShow, setIsEditGroupShow] = useState(false);
  const [validationErr, setValidationErr] = useState({
    name: false,
    proxies: false,
  });

  const [isDeleteAccountShow, setIsDeleteAccountShow] = useState(false);
  const [isEditAccountShow, setIsEditAccountShow] = useState(false);
  const [isEditAccountValue, setIsEditAccountValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowDeleteAll, setIsShowDeleteAll] = useState(false);
  const [isShowEditAll, setIsShowEditAll] = useState(false);
  const [editAllValue, setEditAllValue] = useState(null);
  const [editAllValidation, setEditAllValidation] = useState(false);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const groupList = useSelector(getGroupList);
  const selectedGroup = useSelector(getActiveGroup);
  const rowsPerPage = 150;

  // Effect to simulate loading state
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Reset to first page when group changes  
  useEffect(() => setCurrentPage(1), [selectedGroup]);

  // Pagination calculations
  const totalPages = Math.ceil(selectedGroup?.proxies?.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const proxies = selectedGroup?.proxies.map((y, idx) => ({...y, idx}));
  const currentRows = proxies?.slice(indexOfFirstRow, indexOfLastRow);

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const proxies = e.target.result.split(/\r?\n/)
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(':');
          if (parts.length >= 4) {
            return {
              id: getId(),
              proxy: `${parts[0]}:${parts[1]}`,
              username: parts[2],
              password: parts[3]
            };
          }
          return null;
        })
        .filter(Boolean);

      if (proxies.length) {
        const newGroup = {
          id: getId(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          proxies
        };
        dispatch(addGroup(newGroup));
        dispatch(initActiveGroup(newGroup));
        toast.success('Proxies imported successfully');
      } else {
        toast.error('No valid proxies found in file');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (!selectedGroup?.proxies?.length) {
      toast.error('No proxies to export');
      return;
    }

    const content = selectedGroup.proxies
      .map(p => `${p.proxy}:${p.username}:${p.password}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedGroup.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Proxies exported successfully');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateGroupState(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name' && validationErr?.name && value) {
      setValidationErr(prev => ({ ...prev, name: false }));
    }

    if (name === 'proxies' && validationErr?.proxies) {
      if (/^((\d{1,3}\.){3}\d{1,3}:\d{1,5}:[^:\s]+:[^:\s]+\n?)*$/.test(value)) {
        setValidationErr(prev => ({ ...prev, proxies: false }));
      }
    }
  };

  const handleCreateProxyGroup = () => {
    if (!createGroupState?.name) {
      setValidationErr(prev => ({ ...prev, name: true }));
      return;
    }

    if (!/^([^:\s]+:[^:\s]+:[^:\s]+:[^:\s]+(?:\n|$))+$/.test(createGroupState?.proxies)) {
      setValidationErr(prev => ({ ...prev, proxies: true }));
      return;
    }

    const proxies = createGroupState.proxies
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [proxy, port, username, password] = line.split(':');
        return {
          id: getId(),
          proxy: `${proxy}:${port}`,
          username,
          password
        };
      });

    dispatch(addGroup({
      id: getId(),
      name: createGroupState.name,
      proxies
    }));

    setIsOpenGroupModal(false);
    toast.success('Proxy group created successfully');
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#14141F]">
        <FadeLoader color="#38ff9b" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-Jakarta600">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Proxy Manager</h1>
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt"
          />
          
          <Button
            onClick={handleImportClick}
            variant="secondary"
            icon={Upload}
          >
            Import
          </Button>

          <Button
            onClick={handleExport}
            variant="secondary" 
            icon={Download}
            disabled={!selectedGroup?.proxies?.length}
          >
            Export
          </Button>

          <Button
            onClick={() => setIsShowEditAll(true)}
            variant="secondary"
            icon={Edit2}
          >
            Edit All
          </Button>

          <Button
            onClick={() => setIsShowDeleteAll(true)}
            variant="secondary"
            icon={Trash2}
          >
            Delete All
          </Button>

          <Button
            onClick={() => setIsOpenGroupModal(true)}
            variant="primary"
            icon={Plus}
          >
            New Group
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[280px,1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-[#1B1B26] rounded-xl p-4">
          <div className="mb-4">
            <Input
              icon={Search}
              placeholder="Search groups..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            {groupList.map(group => (
              <div 
                key={group.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  group.id === selectedGroup?.id
                    ? "bg-[#38ff9b]/10"
                    : "hover:bg-[#2A2A40]"
                }`}
              >
                <button
                  onClick={() => dispatch(initActiveGroup(group))}
                  className="flex-1 text-left"
                >
                  <span className="text-white">{group.name}</span>
                  <span className="ml-2 text-sm text-gray-400">
                    ({group.proxies.length})
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCreateGroupState({
                        ...group,
                        proxies: parseProxiesArray(group.proxies)
                      });
                      setIsEditGroupShow(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDeleteGroupShow(group)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#1B1B26] rounded-xl p-6">
          <div className="mb-6">
            <Input
              icon={Search}
              placeholder="Search proxies..."
              className="w-full max-w-md"
            />
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#2A2A40] text-white">
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} className="p-4 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A40]">
                {currentRows?.map((proxy, i) => (
                  <tr key={i} className="hover:bg-[#2A2A40]/50">
                    <td className="p-4">{proxy.idx + 1}</td>
                    <td className="p-4">{proxy.proxy}</td>
                    <td className="p-4">{proxy.username}</td>
                    <td className="p-4">{proxy.password}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setIsEditAccountShow(proxy);
                            setIsEditAccountValue(proxy);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsDeleteAccountShow(proxy)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, selectedGroup?.proxies?.length)} of {selectedGroup?.proxies?.length} proxies
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </Button>

                <span className="text-white px-4">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog
        open={isOpenGroupModal}
        onClose={() => {
          setIsOpenGroupModal(false);
          setValidationErr({ name: false, proxies: false });
        }}
        title="Create Proxy Group"
        primaryAction={{
          label: "Create",
          onClick: handleCreateProxyGroup
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setIsOpenGroupModal(false);
            setValidationErr({ name: false, proxies: false });
          }
        }}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-white">Group Name</label>
              {validationErr.name && (
                <span className="text-red-500 text-sm">Invalid group name</span>
              )}
            </div>
            <Input
              name="name"
              placeholder="Enter group name"
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-white">Proxies</label>
              {validationErr.proxies && (
                <span className="text-red-500 text-sm">Invalid proxy format</span>
              )}
            </div>
            <textarea
              name="proxies"
              placeholder="IP:Port:Username:Password"
              onChange={handleChange}
              className="w-full h-48 p-3 bg-[#2A2A40] text-white rounded-lg 
                       resize-none focus:outline-none focus:ring-2 focus:ring-[#38ff9b]/50"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isEditGroupShow}
        onClose={() => {
          setIsEditGroupShow(false);
          setCreateGroupState(null);
        }}
        title="Edit Proxy Group"
        primaryAction={{
          label: "Save",
          onClick: handleEditGroup
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setIsEditGroupShow(false);
            setCreateGroupState(null);
          }
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="text-white block mb-2">Group Name</label>
            <Input
              name="name"
              value={createGroupState?.name}
              onChange={handleChange}
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className="text-white block mb-2">Proxies</label>
            <textarea
              name="proxies"
              value={createGroupState?.proxies}
              onChange={handleChange}
              placeholder="IP:Port:Username:Password"
              className="w-full h-48 p-3 bg-[#2A2A40] text-white rounded-lg 
                       resize-none focus:outline-none focus:ring-2 focus:ring-[#38ff9b]/50"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!isDeleteGroupShow}
        onClose={() => setIsDeleteGroupShow(false)}
        title="Delete Proxy Group"
        primaryAction={{
          label: "Delete",
          onClick: handleDeleteGroup
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setIsDeleteGroupShow(false)
        }}
      >
        <p className="text-gray-400">
          Are you sure you want to delete this proxy group? This action cannot be undone.
        </p>
      </Dialog>

      <Dialog
        open={!!isEditAccountShow}
        onClose={() => {
          setIsEditAccountShow(false);
          setIsEditAccountValue(null);
        }}
        title="Edit Proxy"
        primaryAction={{
          label: "Save",
          onClick: handleEditAccount
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setIsEditAccountShow(false);
            setIsEditAccountValue(null);
          }
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="text-white block mb-2">Proxy</label>
            <Input
              value={typeof isEditAccountValue === "string"
                ? isEditAccountValue
                : `${isEditAccountValue?.proxy}:${isEditAccountValue?.username}:${isEditAccountValue?.password}`
              }
              onChange={(e) => {
                const parsedVal = proxiesStrToArray(e.target?.value);
                setIsEditAccountValue(parsedVal ? parsedVal : e.target?.value);
              }}
              placeholder="IP:Port:Username:Password"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!isDeleteAccountShow}
        onClose={() => setIsDeleteAccountShow(false)}
        title="Delete Proxy"
        primaryAction={{
          label: "Delete",
          onClick: handleDeleteAccount
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setIsDeleteAccountShow(false)
        }}
      >
        <p className="text-gray-400">
          Are you sure you want to delete this proxy? This action cannot be undone.
        </p>
      </Dialog>

      <Dialog
        open={isShowEditAll}
        onClose={() => {
          setIsShowEditAll(false);
          setEditAllValidation(false);
        }}
        title="Edit All Proxies"
        primaryAction={{
          label: "Save",
          onClick: handleEditAll
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => {
            setIsShowEditAll(false);
            setEditAllValidation(false);
          }
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-white">Proxies</label>
            {editAllValidation && (
              <span className="text-red-500 text-sm">Invalid proxy format</span>
            )}
          </div>
          <textarea
            onChange={(e) => setEditAllValue(e.target?.value)}
            value={editAllValue}
            placeholder="IP:Port:Username:Password"
            className="w-full h-64 p-3 bg-[#2A2A40] text-white rounded-lg 
                     resize-none focus:outline-none focus:ring-2 focus:ring-[#38ff9b]/50"
          />
        </div>
      </Dialog>

      <Dialog
        open={isShowDeleteAll}
        onClose={() => setIsShowDeleteAll(false)}
        title="Delete All Proxies"
        primaryAction={{
          label: "Delete",
          onClick: handleDeleteAllProxies
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setIsShowDeleteAll(false)
        }}
      >
        <p className="text-gray-400">
          Are you sure you want to delete all proxies? This action cannot be undone.
        </p>
      </Dialog>
    </div>
  );
};

export default Proxy;