import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import IconArchive from '../assets/images/icon-archive.svg?react';
import IconDelete from '../assets/images/icon-delete.svg?react';
import IconRestore from '../assets/images/icon-restore.svg?react';

const ModelMsg = ({ type, onCancel, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Check if the current path is the archive page
  const isArchivePage = location.pathname.includes('/archive-note');

  // Dynamically decide Archive or Restore
  const isRestore = isArchivePage && type !== 'delete';

  const info = {
    delete: {
      title: 'Delete Note',
      details: 'Are you sure you want to permanently delete this note? This action cannot be undone.',
      btnBg: 'bg-red-500',
      icon: <IconDelete />,
      buttonText: 'Delete',
    },
    archive: {
      title: isRestore ? 'Restore Note' : 'Archive Note',
      details: isRestore
        ? 'Are you sure you want to restore this note? It will be moved back to all notes.'
        : 'Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.',
      btnBg: 'bg-blue-500',
      icon: isRestore ? <IconRestore /> : <IconArchive />,
      buttonText: isRestore ? 'Restore' : 'Archive',
    },
  };

  // Ensure type exists in info
  if (!info[type]) return null;

  const { title, details, btnBg, icon, buttonText } = info[type];

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg w-[343px] sm:w-[440px]">
        <div className="border-b-2 dark:border-gray-700 flex gap-4 p-5">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 dark:text-white w-10 h-10 rounded-lg">{icon}</div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{details}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 py-4 px-5">
          <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 active:scale-95" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className={`px-4 py-2 rounded text-white ${btnBg} flex items-center justify-center active:scale-95`} onClick={handleConfirm} disabled={loading}>
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ModelMsg.propTypes = {
  type: PropTypes.oneOf(['delete', 'archive']).isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ModelMsg;