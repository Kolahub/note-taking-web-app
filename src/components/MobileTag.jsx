import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction, mobileAction } from '../store';
import { useTheme } from '../context/theme/ThemeContext';

function MobileTag() {
  const [tags, setTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const dispatch = useDispatch();
  const activeTag = useSelector((state) => state.note.filteredTag);
  const { isLoading: isThemeLoading } = useTheme();

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
          const getTagsEach = getTags.join(',').split(',');
          const getTagsSet = [...new Set(getTagsEach)].filter((tag) => tag.trim() !== '');
          setTags(getTagsSet);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchNotes();
  }, []);

  const handleFilterBasedTags = (tag) => {
    dispatch(noteAction.filterBasedTags(tag.trim()));
    dispatch(noteAction.cancelActiveSettings());
    dispatch(mobileAction.callShowTaggedNotes());
  };

  // Loading state
  if (isThemeLoading || isLoadingTags) {
    return (
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
    );
  }

  return (
    <div className="bg-white dark:bg-black h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-950 dark:text-gray-100 mb-4">Tags</h1>

        {tags.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No tags found</p>
          </div>
        ) : (
          <div>
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

export default MobileTag;
