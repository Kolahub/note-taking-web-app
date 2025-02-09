import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from '../config/SupabaseConfig';
import { noteAction } from '../store';

function Tags() {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const activeTag = useSelector((state) => state.filteredTag); // Get active tag

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from('notes').select().order('created_at', { ascending: false });
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        const getTags = data.map((note) => note.tags);
        const getTagsEach = getTags.join(',').split(',');
        const getTagsSet = [...new Set(getTagsEach)];
        setTags(getTagsSet);
      }
    };
    fetchNotes();
  }, []);

  const handleFilterBasedTags = (tag) => {
    dispatch(noteAction.filterBasedTags(tag));

    dispatch(noteAction.cancelActiveSettings());
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className="border-t-2 mt-4 py-2">
          <h2 className="text-gray-500 text-xl">Tags</h2>
          <div className="mt-2">
            {tags.map((tag, i) => (
              <button
                key={`${tag}${i}`}
                onClick={() => handleFilterBasedTags(tag)}
                className={`group flex justify-between items-center w-full mb-1 last:mb-0 rounded-lg p-3 transition
                  ${activeTag === tag ? 'bg-gray-100 text-blue-500' : 'hover:bg-gray-100'}
                `}
              >
                <div className="flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={`text-[#0E121B] ${activeTag === tag ? 'text-blue-500' : 'group-hover:text-blue-500'}`}
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
                  <p className="text-gray-800">{tag}</p>
                </div>

                {/* Arrow SVG: Always visible for active tag */}
                <div className={activeTag === tag ? 'block' : 'hidden group-hover:block'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="rotate-180">
                    <path fill="currentColor" fillRule="evenodd" d="M15.75 20.414 7.336 12l8.414-8.414L17.164 5l-7 7 7 7-1.414 1.414Z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tags;
