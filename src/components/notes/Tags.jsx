import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { noteAction, mobileAction } from '../../store';
import supabase from '../../config/SupabaseConfig';
/**
 * Responsive Tags component that handles both desktop sidebar tags and mobile tag screen.
 * This component consolidates what was previously separate Tags and MobileTag components.
 * - For desktop: Displays as a section in the sidebar showing available tags
 * - For mobile: Displays as a full-screen modal when tag navigation is selected
 */
function Tags() {
  const [tags, setTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const dispatch = useDispatch();
  const activeTag = useSelector((state) => state.note.filteredTag);
  const isMobileView = useSelector((state) => state.mobile.showTag);

  // Select active and archived notes from store
  const notes = useSelector((state) => state.note.notes);
  const archivedNotes = useSelector((state) => state.note.archivedNotes);
  const allNotes = useMemo(() => [...notes, ...archivedNotes], [notes, archivedNotes]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('No user logged in');

        const { data, error } = await supabase.from('notes').select().eq('user_id', user.id).order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const getTags = data.map((note) => note.tags);
          const getTagsEach = getTags.flatMap((tags) => tags.split(/[,\s]/).filter((tag) => tag !== ''));
          const getTagsSet = [...new Set(getTagsEach)].filter((tag) => tag.trim() !== '');
          setTags(getTagsSet);
          // console.log(getTags, getTagsEach, getTagsSet, '❤️❤️💪💪');
          
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchNotes();
  }, []); // No need for notes dependency since we're using allNotes

  // Listen for note changes in the store
  useEffect(() => {
    if (allNotes.length > 0) {
      const getTags = allNotes.map((note) => note.tags);
      const getTagsEach = getTags.flatMap((tags) => tags.split(/[,\s]/).filter((tag) => tag !== ''));
      const getTagsSet = [...new Set(getTagsEach)].filter((tag) => tag.trim() !== '');
      setTags(getTagsSet);
    }
  }, [allNotes]); // Add allNotes as a dependency to refresh when notes change

  const handleFilterBasedTags = (tag) => {
    dispatch(noteAction.filterBasedTags(tag.trim()));
    dispatch(noteAction.cancelActiveSettings());

    // Only trigger mobile tagged notes view if in mobile view
    if (isMobileView) {
      dispatch(mobileAction.callShowTaggedNotes());
    }
  };

  // Loading state
  if (isLoadingTags) {
    return isMobileView ? (
      <div className="bg-white dark:bg-black h-full overflow-y-auto">
        <div className="p-3 sm:p-4 bg-white dark:bg-black">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-950 dark:text-gray-100 mb-3 sm:mb-4">Tags</h1>
          <div className="animate-pulse space-y-2">
            <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    ) : (
      <div className="border-t-2 dark:border-gray-800 mt-4 py-2 animate-pulse">
        <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3 sm:mb-4"></div>
        <div className="space-y-2">
          <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Mobile view
  if (isMobileView) {
    return (
      <div className="bg-white dark:bg-black h-full" style={{
        overscrollBehavior: 'contain',
        touchAction: 'pan-y'
      }}>
        <div className="px-4 sm:px-6 md:px-8 border-b dark:border-gray-800 h-[64px] md:h-[64px] flex items-center">
          <h1 className="text-2xl font-semibold text-gray-950 dark:text-gray-100">Tags</h1>
        </div>
        <div className="p-4 sm:px-6 md:px-8">

          {tags.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No tags found</p>
            </div>
          ) : (
            <div className='h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide -mx-4 px-4' style={{
              overscrollBehavior: 'contain',
              touchAction: 'pan-y'
            }}>
              {tags.map((tag, i) => (
                <div key={`${tag}${i}`} className="border-b border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => handleFilterBasedTags(tag)}
                    className={`flex items-center w-full py-4 transition ${
                      activeTag === tag ? 'text-blue-500' : 'text-gray-950 dark:text-gray-100'
                    } active:bg-gray-100 dark:active:bg-gray-800 focus:outline-none`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      className={`${activeTag === tag ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'} mr-3`}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3.016 5.966c.003-1.411 1.07-2.677 2.456-2.916.284-.05 3.616-.042 4.995-.041 1.364 0 2.527.491 3.49 1.452 2.045 2.042 4.088 4.085 6.128 6.13 1.208 1.21 1.224 3.066.022 4.28a805.496 805.496 0 0 1-5.229 5.228c-1.212 1.201-3.069 1.186-4.279-.022-2.064-2.058-4.127-4.115-6.182-6.182-.795-.8-1.264-1.766-1.368-2.895-.084-.903-.035-4.26-.033-5.034Z"
                        clipRule="evenodd"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M9.907 8.315a1.607 1.607 0 0 1-1.61 1.583c-.872-.002-1.599-.73-1.594-1.596a1.604 1.604 0 0 1 1.633-1.607c.864.003 1.575.736 1.571 1.62Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{tag}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="border-t-2 dark:border-gray-800 mt-4 py-2">
      <h2 className="text-gray-500 dark:text-gray-400 text-xl">Tags</h2>
      <div className="mt-2 max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-hide">
        {tags.map((tag, i) => (
          <button
            key={`${tag}${i}`}
            onClick={() => handleFilterBasedTags(tag)}
            className={`group flex justify-between items-center w-full mb-1 last:mb-0 rounded-lg p-3 transition
              ${activeTag === tag ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className={`${activeTag === tag ? 'text-blue-500' : 'text-gray-950 dark:text-gray-200 group-hover:text-blue-500'}`}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3.016 5.966c.003-1.411 1.07-2.677 2.456-2.916.284-.05 3.616-.042 4.995-.041 1.364 0 2.527.491 3.49 1.452 2.045 2.042 4.088 4.085 6.128 6.13 1.208 1.21 1.224 3.066.022 4.28a805.496 805.496 0 0 1-5.229 5.228c-1.212 1.201-3.069 1.186-4.279-.022-2.064-2.058-4.127-4.115-6.182-6.182-.795-.8-1.264-1.766-1.368-2.895-.084-.903-.035-4.26-.033-5.034Z"
                  clipRule="evenodd"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M9.907 8.315a1.607 1.607 0 0 1-1.61 1.583c-.872-.002-1.599-.73-1.594-1.596a1.604 1.604 0 0 1 1.633-1.607c.864.003 1.575.736 1.571 1.62Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-950 dark:text-gray-100">{tag}</p>
            </div>
            <div className={`${activeTag === tag ? 'block' : 'hidden group-hover:block'} text-gray-950 dark:text-gray-50`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="rotate-180">
                <path fill="currentColor" fillRule="evenodd" d="M15.75 20.414 7.336 12l8.414-8.414L17.164 5l-7 7 7 7-1.414 1.414Z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tags;
