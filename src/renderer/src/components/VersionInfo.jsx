// src/renderer/src/components/VersionInfo.jsx
const VersionInfo = () => {
  const versions = window.electron.process.versions;

  return (
    <div className="flex items-center gap-4 text-sm text-gray-400">
      <span>Electron {versions.electron}</span>
      <span>•</span>
      <span>Chromium {versions.chrome}</span>
      <span>•</span>
      <span>Node {versions.node}</span>
    </div>
  );
};

export { VersionInfo };