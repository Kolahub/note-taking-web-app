import Navbar from '../components/Navbar';
import Logo from '../assets/images/logo.svg?react';
import NoteBars from '../components/NoteBars';
import CleanSweep from '../components/CleanSweep';
import NoteForm from '../components/NoteForm';
import { useDispatch, useSelector } from 'react-redux';
import SubNav from '../components/SubNav';
import Settings from '../components/Settings';
import { useLocation } from 'react-router-dom';
import Toast from '../components/Toast';
import { toastAction } from '../store';

function Dashboard() {
  const allNotes = useSelector((state) => state.note.notes);
  const allArchiveNotes = useSelector((state) => state.note.archivedNotes);
  const newNoteI = useSelector((state) => state.note.newNoteI);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toast);

  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  const allOrArchiveNotes = allNotePath ? allNotes : archiveNotePath ? allArchiveNotes : [];
  console.log(allNotes, '🤣🤣')

  return (
    <div className="bg-white dark:bg-black grid grid-cols-10 h-screen grid-rows-[auto,1fr]">
      <div className="border-r-2 dark:border-gray-800 px-4 pt-3 row-span-2 col-start-1 col-span-2">
        <div className="mb-4 text-black dark:text-white">
          <Logo />
        </div>
        <Navbar />
      </div>

      <div className="border-b-2 dark:border-gray-800 col-start-3 col-span-8 row-start-1">
        <SubNav />
      </div>

      <div className="col-start-3 col-span-2 row-start-2 overflow-auto scrollbar-hide">
        <NoteBars />
      </div>

      <div className="col-start-5 col-span-4 row-start-2 overflow-auto scrollbar-hide">
        {settingsActive ? <Settings /> : (newNoteI || allOrArchiveNotes.length > 0) && <NoteForm />}
      </div>

      <div className="col-start-9 col-span-2 row-start-2 overflow-auto">{!settingsActive && allOrArchiveNotes.length > 0 && <CleanSweep />}</div>


<div className="">
  {toastState.show && (
    <Toast
      message={toastState.message}
      subText={toastState.subText}
      onClose={() => dispatch(toastAction.hideToast())}
    />
  )}
</div>
    </div>
  );
}

export default Dashboard;