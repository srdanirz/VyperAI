import { useState, useRef, useEffect } from "react";
import CustomisedDialog from "../components/Dialog";
import Button from "../components/Button";
import { addIcon, deleteIcon, editIcon } from "../utils/Images";
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
import ModalContainer from "../modals/ModalContainer";
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

  // Modal states
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

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedGroup]);
  
  // Pagination calculations
  const totalPages = Math.ceil(selectedGroup?.proxies.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const proxies = selectedGroup?.proxies.map((y, idx) => ({...y, idx}));
  const currentRows = proxies?.slice(indexOfFirstRow, indexOfLastRow);

  // File handlers
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      let proxies = [];
      if (e.target.result.includes("\r\n")) {
        proxies = e.target.result.split("\r\n");
      } else {
        proxies = e.target.result.split("\n");
      }
      
      proxies = proxies
        .filter(proxyStr => proxyStr.trim() !== '')
        .map((proxyStr) => {
          const tempArr = proxyStr.split(":");
          if (tempArr.length >= 4) {
            return {
              id: getId(),
              proxy: tempArr[0] + ":" + tempArr[1],
              username: tempArr[2],
              password: tempArr[3],
            };
          }
          return null;
        })
        .filter((proxy) => proxy !== null);
  
      if (proxies.length > 0) {
        const newGroupName = file.name.replace(/\.[^/.]+$/, "");
        const newGroup = {
          id: getId(),
          name: newGroupName,
          proxies: proxies,
        };
  
        dispatch(addGroup(newGroup));
        dispatch(initActiveGroup(newGroup));
      } else {
        alert("No valid proxies found in the file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (!selectedGroup || selectedGroup.proxies.length === 0) return;

    const fileContent = selectedGroup.proxies
      .map((proxy) => `${proxy.proxy}:${proxy.username}:${proxy.password}`)
      .join("\n");

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedGroup.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateGroupState((prev) => ({ ...prev, [name]: value }));
    
    if (name === "name" && validationErr?.name && value) {
      setValidationErr((prev) => ({
        ...prev,
        name: false,
      }));
    }
    
    if (name === "proxies" && validationErr?.proxies) {
      if (/^((\d{1,3}\.){3}\d{1,3}:\d{1,5}:[^:\s]+:[^:\s]+\n?)*$/.test(value)) {
        setValidationErr((prev) => ({
          ...prev,
          proxies: false,
        }));
      }
    }
  };

  // Group handlers
  const handleCreateProxyGroup = () => {
    if (!createGroupState?.name) {
      setValidationErr((prev) => ({
        ...prev,
        name: true,
      }));
      return;
    }
    if (
      !/^([^:\s]+:[^:\s]+:[^:\s]+:[^:\s]+(?:\n|$))+$/.test(
        createGroupState?.proxies,
      )
    ) {
      setValidationErr((prev) => ({
        ...prev,
        proxies: true,
      }));
      return;
    }

    dispatch(
      addGroup({
        name: createGroupState?.name,
        id: getId(),
        proxies: createGroupState?.proxies
          ? createGroupState?.proxies.split("\n")?.map((proxiesStr) => {
              const tempArr = proxiesStr?.split(":");
              return {
                id: getId(),
                proxy: tempArr[0] + ":" + tempArr[1],
                username: tempArr[2],
                password: tempArr[3],
              };
            })
          : [],
      }),
    );
    setIsOpenGroupModal(false);
  };

  const handleEditGroup = () => {
    const payload = {
      name: createGroupState?.name,
      id: createGroupState?.id,
      proxies: createGroupState?.proxies
        ? createGroupState?.proxies.split("\n")?.map((proxiesStr) => {
            const tempArr = proxiesStr?.split(":");
            return {
              id: getId(),
              proxy: tempArr[0] + ":" + tempArr[1],
              username: tempArr[2],
              password: tempArr[3],
            };
          })
        : [],
    };

    dispatch(updateGroup(payload));
    if (payload?.id === selectedGroup?.id) dispatch(initActiveGroup(payload));
    setIsEditGroupShow(false);
  };

  const handleGroupClicked = (group) => {
    dispatch(initActiveGroup(group));
  };

  const handleDeleteGroup = (group) => {
    dispatch(deleteGroup(isDeleteGroupShow?.id));
    if (isDeleteGroupShow?.id === selectedGroup?.id)
      dispatch(initActiveGroup(null));
    setIsDeleteGroupShow(false);
  };

  // Account handlers
  const handleDeleteAccount = () => {
    if (isDeleteAccountShow) {
      const payload = {
        ...selectedGroup,
        proxies: selectedGroup?.proxies?.filter(
          (acc) => acc?.id != isDeleteAccountShow?.id,
        ),
      };
      dispatch(updateGroup(payload));
      dispatch(initActiveGroup(payload));
      setIsDeleteAccountShow(false);
    }
  };

  const handleEditAccount = () => {
    const payload = {
      ...isEditAccountValue,
      id: isEditAccountShow?.id,
    };

    const updatedGroup = {
      ...selectedGroup,
      proxies: selectedGroup?.proxies.map((acc) =>
        acc?.id === payload?.id ? payload : acc,
      ),
    };

    dispatch(updateGroup(updatedGroup));
    dispatch(initActiveGroup(updatedGroup));
    setIsEditAccountShow(false);
    setIsEditAccountValue(false);
  };

  const handleEditAll = () => {
    const proxyRegex = /^([^:\s]+):(\d+):([^:\s]+):([^:\s]+(?:_[^:\s]+)*)$/;
    
    const proxiesAreValid = editAllValue.split('\n').every(line => 
      line.trim() === '' || proxyRegex.test(line.trim())
    );
  
    if (proxiesAreValid) {
      setEditAllValidation(false);
      const formattedProxies = editAllValue.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const [host, port, username, rest] = line.split(':');
          const password = rest.split('_')[0];
          return {
            id: getId(),
            proxy: `${host}:${port}`,
            username: username,
            password: password
          };
        });
  
      dispatch(
        updateGroup({
          ...selectedGroup,
          proxies: formattedProxies,
        })
      );
      dispatch(
        initActiveGroup({
          ...selectedGroup,
          proxies: formattedProxies,
        })
      );
      setIsShowEditAll(false);
    } else {
      setEditAllValidation(true);
    }
  };

  const handleDeleteAllProxies = () => {
    dispatch(
      updateGroup({
        ...selectedGroup,
        proxies: [],
      }),
    );
    dispatch(
      initActiveGroup({
        ...selectedGroup,
        proxies: [],
      }),
    );
    setIsShowDeleteAll(false);
  };

  // Modal components
  const renderModals = () => (
    <>
      <CustomisedDialog
        {...{
          icon: addIcon,
          title: "Create Proxy Group",
          className: "hidden", // Ocultamos el botón del dialog
          // Eliminamos buttonText ya que no necesitamos este botón
          leftBtnStyle: "",
          rightBtnStyle: "",
          rightBtnText: "Create",
          leftBtnText: "Cancel",
          open: isOpenGroupModal,
          handleClose: () => {
            setIsOpenGroupModal(false);
            setValidationErr({ name: false, proxies: false });
          },
          openModal: () => setIsOpenGroupModal(true),
          handleSubmit: handleCreateProxyGroup,
        }}
      >
        <div className="w-[500px] text-white p-6 space-y-3">
          <div className="flex items-center gap-2">
            <p>Proxy Group Name</p>
            {validationErr.name && (
              <p className="text-[#ff3856] font-Jakarta300 text-[14px]">
                (Invalid group name)
              </p>
            )}
          </div>
          <div className="rounded-[10px] bg-[#1B1B26] mt-2 w-fit">
            <input
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="Enter Proxy Group Name"
              className="bg-[#14141F] w-[430px] rounded-[10px] outline-none p-3"
            />
          </div>
        </div>
        <div className="text-white px-6 pb-9 space-y-3">
          <div className="flex items-center gap-2">
            <p>List of Proxies</p>
            {validationErr?.proxies && (
              <p className="text-[#ff3856] font-Jakarta300 text-[14px]">
                (Invalid proxies format)
              </p>
            )}
          </div>
          <textarea
            name="proxies"
            onChange={handleChange}
            className="rounded-[10px] bg-[#14141F] w-full h-[240px] p-3 border-solid border-0 outline-none"
            placeholder="IP:Port:Username:Password"
          ></textarea>
        </div>
      </CustomisedDialog>

      <ModalContainer
        {...{
          icon: editIcon,
          title: "Edit Proxy Group",
          rightBtnText: "Save",
          leftBtnText: "Cancel",
          rightBtnStyle: "edit",
          open: isEditGroupShow,
          handleClose: () => {
            setIsEditGroupShow(false);
            setCreateGroupState(null);
          },
          handleSubmit: handleEditGroup,
        }}
      >
        <div className="text-white">
          <p>Proxy Group Name</p>
          <div className="rounded-[10px] bg-[#14141F] w-fit mt-2">
            <input
              name="name"
              onChange={handleChange}
              type="text"
              value={createGroupState?.name}
              className="bg-[#14141F] w-[430px] rounded-[10px] outline-none p-3"
            />
          </div>
        </div>
        <div className="text-white mt-6">
          <p>List of Proxies</p>
          <textarea
            name="proxies"
            value={createGroupState?.proxies}
            onChange={handleChange}
            className="rounded-[10px] mt-2 bg-[#14141F] w-full h-[240px] p-3 border-solid border-0 outline-none"
          ></textarea>
        </div>
      </ModalContainer>

      <ModalContainer
        {...{
          children: "",
          title: "Delete Proxy Group?",
          leftBtnStyle: "",
          rightBtnStyle: "delete",
          rightBtnText: "Delete",
          leftBtnText: "Cancel",
          description: "Are you sure you want to delete this group?",
          open: isDeleteGroupShow ? true : false,
          handleClose: () => setIsDeleteGroupShow(false),
          handleSubmit: handleDeleteGroup,
        }}
      />

      <ModalContainer
        {...{
          icon: editIcon,
          title: "Edit All Proxies",
          rightBtnText: "Edit",
          leftBtnText: "Cancel",
          rightBtnStyle: "edit",
          open: isShowEditAll,
          handleClose: () => {
            setIsShowEditAll(false);
            setEditAllValidation(false);
          },
          handleSubmit: handleEditAll,
        }}
      >
        <div className="text-white my-5">
          <div className="flex gap-2 items-center">
            <p>Proxies</p>
            {editAllValidation && (
              <p className="text-[#ff3856] font-Jakarta300 text-[14px]">
                (Invalid proxies format)
              </p>
            )}
          </div>
          <div className="rounded-[10px] bg-[#14141F] mt-2">
            <textarea
              onChange={(e) => setEditAllValue(e.target?.value)}
              value={editAllValue}
              className="bg-[#14141F] p-3 w-full rounded-[10px] outline-none h-[300px]"
              placeholder="IP:Port:Username:Password"
              rows="10"
            ></textarea>
          </div>
        </div>
      </ModalContainer>

      <ModalContainer
        {...{
          icon: deleteIcon,
          title: "Delete All Proxies",
          rightBtnText: "Delete",
          leftBtnText: "Cancel",
          rightBtnStyle: "delete",
          description: "Are you sure you want to delete all proxies?",
          open: isShowDeleteAll,
          handleClose: () => setIsShowDeleteAll(false),
          handleSubmit: handleDeleteAllProxies,
        }}
      />

      <ModalContainer
        {...{
          icon: editIcon,
          title: "Edit Proxy",
          rightBtnText: "Edit",
          leftBtnText: "Cancel",
          rightBtnStyle: "edit",
          open: isEditAccountShow ? true : false,
          handleClose: () => {
            setIsEditAccountShow(false);
            setIsEditAccountValue(null);
          },
          handleSubmit: handleEditAccount,
        }}
      >
        <div className="text-white my-5">
          <p>Proxy</p>
          <div className="rounded-[10px] bg-[#14141F] mt-2">
            <input
              onChange={(e) => {
                const parsedVal = proxiesStrToArray(e.target?.value);
                setIsEditAccountValue(parsedVal ? parsedVal : e.target?.value);
              }}
              value={
                typeof isEditAccountValue === "string"
                  ? isEditAccountValue
                  : `${isEditAccountValue?.proxy}:${isEditAccountValue?.username}:${isEditAccountValue?.password}`
              }
              type="text"
              className="bg-[#14141F] p-3 w-full rounded-[10px] outline-none h-[45px]"
            />
          </div>
        </div>
      </ModalContainer>

      <ModalContainer
        {...{
          icon: deleteIcon,
          title: "Delete Proxy",
          rightBtnText: "Delete",
          leftBtnText: "Cancel",
          rightBtnStyle: "delete",
          description: "Are you sure you want to delete this proxy?",
          open: isDeleteAccountShow ? true : false,
          handleClose: () => setIsDeleteAccountShow(false),
          handleSubmit: handleDeleteAccount,
        }}
      />
    </>
  );

  // Main render
  return (
    <div className="h-full pb-20 pt-3 p-8 font-Jakarta600">
      {isLoading ? (
        <div className="absolute left-0 right-0 top-10 bottom-0 flex justify-center items-center bg-[#14141F]">
          <FadeLoader color="#38ff9b" />
        </div>
      ) : (
        <div className="flex h-full gap-6">
          {/* Left Panel */}
          <div className="w-72 bg-[#14141F] rounded-[10px] p-5 relative">
            {/* New Proxy Group Button */}
            <button
              onClick={() => setIsOpenGroupModal(true)}
              className="flex items-center justify-center gap-2 w-full h-[40px] 
                       bg-[#38ff9b] hover:bg-[#57ffb3] transition-all duration-300 
                       text-black rounded-[10px] mb-6"
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
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="font-medium">New Proxy Group</span>
            </button>

            {/* Proxy Groups List */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
              {groupList.map((group) => (
                <div
                  key={group.id}
                  className={`flex items-center justify-between p-3 rounded-[10px] transition-all duration-300
                           ${group?.id === selectedGroup?.id ? "bg-[#202831]" : "hover:bg-[#202831]"}`}
                >
                  <button
                    onClick={() => handleGroupClicked(group)}
                    className="flex-1 text-left text-[15px]"
                  >
                    {group?.name}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCreateGroupState({
                          ...group,
                          proxies: parseProxiesArray(group?.proxies),
                        });
                        setIsEditGroupShow(true);
                      }}
                      className="p-1.5 hover:bg-[#2A2A40] rounded-md transition-all duration-300"
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none"
                        stroke="#38ff9b" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsDeleteGroupShow(group)}
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
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-[#14141F] rounded-[10px] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium">Proxy List</h1>
                <div className="bg-[#38ff9b] text-black px-3 py-1 rounded-[10px] text-sm">
                  {selectedGroup ? selectedGroup?.proxies?.length : 0}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                
                {/* Action Buttons */}
                {/* Import Button */}
                <button
                  onClick={handleImportClick}
                  className="flex items-center gap-2 h-[40px] px-4 
                            bg-[#1B1B26] hover:bg-[#2A2A40] 
                            rounded-[10px] transition-all duration-300"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="#38ff9b" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Import</span>
                </button>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 h-[40px] px-4 
                            bg-[#1B1B26] hover:bg-[#2A2A40] 
                            rounded-[10px] transition-all duration-300"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="#38ff9b" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export</span>
                </button>

                {/* Edit All Button */}
                <button
                  onClick={() => {
                    setEditAllValue(proxiesArrayToStr(selectedGroup?.proxies));
                    setIsShowEditAll(true);
                  }}
                  className="flex items-center gap-2 h-[40px] px-4 
                            bg-[#1B1B26] hover:bg-[#2A2A40] 
                            rounded-[10px] transition-all duration-300"
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    stroke="#38ff9b" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  <span>Edit All</span>
                </button>

                {/* Delete All Button */}
                <button
                  onClick={() => setIsShowDeleteAll(true)}
                  className="flex items-center gap-2 h-[40px] px-4 
                            bg-[#1B1B26] hover:bg-[#2A2A40] 
                            rounded-[10px] transition-all duration-300"
                >
                  <svg 
                    width="18" 
                    height="18" 
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
                  <span>Delete All</span>
                </button>
              </div>
            </div>

           {/* Table Section */}
            <div className="bg-[#1B1B26] rounded-[10px] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#14141F] sticky top-0">
                  <tr>
                    {columns.map((col, id) => (
                      <th
                        key={id}
                        className={`p-4 font-semibold whitespace-nowrap ${
                          id === 0 ? 'text-center' : 'text-left'  // Centramos el header de Task
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A40]">
                  {currentRows?.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#202831] transition-all duration-300"
                    >
                      <td className="p-4 text-center">{row.idx + 1}</td>  {/* Centramos el número */}
                      <td className="p-4 max-w-[200px] truncate">{row.proxy}</td>
                      <td className="p-4 max-w-[200px] truncate">{row.username}</td>
                      <td className="p-4 max-w-[200px] truncate">
                        {row.password}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsEditAccountShow(row);
                              setIsEditAccountValue(row);
                            }}
                            className="p-1.5 hover:bg-[#2A2A40] rounded-md transition-all duration-300"
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none"
                              stroke="#38ff9b" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setIsDeleteAccountShow(row)}
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
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center p-4 bg-[#14141F] border-t border-[#2A2A40]">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-[40px] px-4 
                              bg-[#1B1B26] hover:bg-[#2A2A40] rounded-[10px] 
                              transition-all duration-300 disabled:opacity-50 
                              disabled:cursor-not-allowed mr-2"
                  >
                    Previous
                  </button>
                  <div className="flex items-center justify-center px-4">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-[40px] px-4 
                              bg-[#1B1B26] hover:bg-[#2A2A40] rounded-[10px] 
                              transition-all duration-300 disabled:opacity-50 
                              disabled:cursor-not-allowed ml-2"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render all modals */}
      {renderModals()}
    </div>
  );
};

export default Proxy;