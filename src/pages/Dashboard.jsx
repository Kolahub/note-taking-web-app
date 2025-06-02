import Navbar from '../components/layout/Navbar';
import Logo from '../assets/images/logo.svg?react';
import NoteBars from '../components/notes/NoteBars';
import CleanSweep from '../components/notes/CleanSweep';
import NoteForm from '../components/forms/NoteForm';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import SubNav from '../components/layout/SubNav';
import Settings from '../components/settings/Settings';
import { useLocation } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import { toastAction } from '../store';
import MobileNoteAction from '../components/mobile/MobileNoteAction';
import MobileSearch from '../components/forms/MobileSearch';
import Tags from '../components/notes/Tags';
import MobileTaggedNotes from '../components/mobile/MobileTaggedNotes';
import { mobileAction, noteAction } from '../store';
import supabase from '../config/SupabaseConfig';

function Dashboard() {
  const allNotes = useSelector((state) => state.note.notes);
  const allArchiveNotes = useSelector((state) => state.note.archivedNotes);
  const newNoteI = useSelector((state) => state.note.newNoteI);
  // const noteDetail = useSelector((state) => state.note.noteDetail);
  const settingsActive = useSelector((state) => state.note.settingsActive);
  const showNote = useSelector((state) => state.mobile.showNote);
  const showSearch = useSelector((state) => state.mobile.showSearch);
  const showTag = useSelector((state) => state.mobile.showTag);
  const showTaggedNotes = useSelector((state) => state.mobile.showTaggedNotes);
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toast);

  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  useEffect(() => {
    // When route changes, fetch the appropriate notes
    const fetchNotes = async () => {
      try {
        dispatch(noteAction.setNotesLoading(true));
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('No user logged in');

        const { data, error } = await supabase
          .from('notes')
          .select()
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          dispatch(noteAction.allNotes(data.filter(note => !note.archived)));
          dispatch(noteAction.allArchivedNotes(data.filter(note => note.archived)));
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        dispatch(noteAction.setNotesLoading(false));
      }
    };

    fetchNotes();
  }, [location.pathname, dispatch]); // Re-run when route changes or dispatch changes

  const allOrArchiveNotes = allNotePath ? allNotes : archiveNotePath ? allArchiveNotes : [];
  // console.log(showNote, '🤣🤣')

  // Add fixed positioning and proper height for mobile view
  return (
    <div className="bg-white dark:bg-black flex flex-col h-screen overflow-hidden">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="text-black dark:text-white px-4 py-2 bg-gray-100 dark:bg-gray-800 h-[64px] flex items-center">
          <Logo />
        </div>
        <div className="border-b-2 dark:border-gray-800">
          <SubNav />
        </div>
      </div>

      {/* Main content area - with padding bottom to account for mobile navbar */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-10 lg:grid-rows-[auto,1fr] overflow-hidden pb-[72px] lg:pb-0">
      {/* Desktop sidebar */}
      <div className="hidden lg:block border-r-2 dark:border-gray-800 lg:px-4 lg:pt-3 lg:row-span-2 lg:col-start-1 lg:col-span-2">
        <div className="text-black dark:text-white px-4 py-2 h-[64px] flex items-center">
          <Logo />
        </div>
        <Navbar />
      </div>

      {/* Desktop subnav */}
      <div className={`hidden lg:block border-b-2 dark:border-gray-800 lg:col-start-3 lg:col-span-8 lg:row-start-1 ${
          showNote || showSearch || showTag || showTaggedNotes ? 'lg:hidden' : settingsActive ? 'lg:hidden' : ''
        }`}>
        <SubNav />
      </div>

      {showNote && (
        <div className="bg-white dark:bg-black">
          <MobileNoteAction />
        </div>
      )}

      <div className={`${showSearch ? 'block' : 'hidden'}`}>
        <MobileSearch onClose={() => dispatch(mobileAction.callHideSearch())} />
      </div>

      <div className={`${showTag ? 'block' : 'hidden'} bg-white dark:bg-black z-20`}>
        <Tags />
      </div>

      <div 
        className={`${showTaggedNotes ? 'block' : 'hidden'} fixed top-[64px] md:top-[57px] lg:top-[64px] left-0 right-0 bottom-[60px] bg-white dark:bg-black z-20 overflow-y-auto`}
        style={{
          height: 'calc(100vh - 124px)',
          maxHeight: 'calc(100vh - 124px)',
          overflowAnchor: 'none',
          overscrollBehaviorY: 'contain'
        }}
      >
        <MobileTaggedNotes />
      </div>

      {/* Notes list */}
      <div className={`flex-1 overflow-hidden ${
          showNote || showSearch || showTag || showTaggedNotes ? 'hidden lg:block' : settingsActive ? 'hidden lg:block' : 'flex flex-col'
        }`}>
        <div className="flex-1 overflow-y-auto">
          <NoteBars />
        </div>
      </div>

      {/* Note form / settings */}
      <div className={`flex-1 overflow-auto ${
          (showNote || settingsActive) ? 'block' : 'hidden lg:block'
        }`}>
        {newNoteI || (allOrArchiveNotes.length > 0 && !settingsActive) ? <NoteForm /> : settingsActive && <Settings />}
      </div>

      {/* Clean sweep */}
      <div className="hidden lg:block lg:col-start-9 lg:col-span-2 lg:row-start-2 overflow-y-auto">
        {!settingsActive && allOrArchiveNotes.length > 0 && <CleanSweep />}
      </div>

      {/* Toast */}
      <div className="fixed bottom-4 right-4 z-50">
        {toastState.show && <Toast message={toastState.message} subText={toastState.subText} onClose={() => dispatch(toastAction.hideToast())} />}
      </div>
      </div> {/* End main content area */}
      
      {/* Mobile navbar - positioned at the bottom of the viewport */}
      <div className="lg:hidden">
        <Navbar />
      </div>
    </div>
  );
}

export default Dashboard;
