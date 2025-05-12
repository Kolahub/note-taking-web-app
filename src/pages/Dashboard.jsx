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
import MobileNav from '../components/MobileNav';
import MobileNoteAction from '../components/MobileNoteAction';
import MobileSearch from '../components/MobileSearch';
import { mobileAction } from '../store';

function Dashboard() {
  const allNotes = useSelector((state) => state.note.notes);
  const allArchiveNotes = useSelector((state) => state.note.archivedNotes);
  const newNoteI = useSelector((state) => state.note.newNoteI);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const showNote = useSelector((state) => state.mobile.showNote);
  const showSearch = useSelector((state) => state.mobile.showSearch);
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toast);

  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  const allOrArchiveNotes = allNotePath ? allNotes : archiveNotePath ? allArchiveNotes : [];
  // console.log(showNote, '🤣🤣')

  return (
    <div className="bg-white dark:bg-black grid lg:grid-cols-10 h-screen lg:grid-rows-[auto,1fr] relative">
      <div className="border-r-2 dark:border-gray-800 lg:px-4 lg:pt-3 lg:row-span-2 lg:col-start-1 lg:col-span-2">
        <div className="text-black dark:text-white px-4 py-2 sm:px-8 sm:py-3 bg-gray-100 dark:bg-black lg:bg-transparent h-[43px] sm:h-[57px]">
          <Logo />
        </div>
        <div className="hidden lg:block">
          <Navbar />
        </div>
      </div>

      <div
        className={`border-b-2 dark:border-gray-800 lg:col-start-3 lg:col-span-8 lg:row-start-1 ${
          showNote || showSearch ? 'hidden lg:block' : settingsActive ? 'hidden' : 'block'
        }`}
      >
        <SubNav />
      </div>

      {showNote && (
        <div className="fixed top-[43px] sm:top-[57px] left-0 right-0 bottom-0 flex flex-col bg-white dark:bg-black z-10 lg:static lg:col-start-5 lg:col-span-4 lg:row-start-2 lg:z-auto mb-[60px]">
          <MobileNoteAction />
          <div className="flex-1 overflow-auto">{(newNoteI || allOrArchiveNotes.length > 0) && <NoteForm />}</div>
        </div>
      )}

      <div className={`${showSearch ? 'block' : 'hidden'}`}>
        <MobileSearch onClose={() => dispatch(mobileAction.callHideSearch())} />
      </div>

      <div
        className={`lg:col-start-3 lg:col-span-2 lg:row-start-2 overflow-auto scrollbar-hide ${
          showNote || showSearch ? 'hidden lg:block' : settingsActive ? 'hidden lg:block' : 'block'
        }`}
      >
        <NoteBars />
      </div>

      <div
        className={`lg:col-start-5 lg:col-span-4 lg:row-start-2 overflow-auto scrollbar-hide ${
          showNote ? 'hidden' : settingsActive ? 'block absolute top-[57px] left-0 right-0 bottom-0' : 'hidden lg:block'
        }`}
      >
        {settingsActive ? <Settings /> : (newNoteI || allOrArchiveNotes.length > 0) && <NoteForm />}
      </div>

      <div className="lg:col-start-9 lg:col-span-2 lg:row-start-2 overflow-auto hidden lg:block">
        {!settingsActive && allOrArchiveNotes.length > 0 && <CleanSweep />}
      </div>

      <div className="lg:hidden">
        <MobileNav />
      </div>

      <div className="">
        {toastState.show && <Toast message={toastState.message} subText={toastState.subText} onClose={() => dispatch(toastAction.hideToast())} />}
      </div>
    </div>
  );
}

export default Dashboard;
