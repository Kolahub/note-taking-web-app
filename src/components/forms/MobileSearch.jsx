import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mobileAction, noteAction } from '../../store';
import IconSearch from '../../assets/images/icon-search.svg?react';
import ArrowLeft from '../../assets/images/icon-arrow-left.svg?react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

function MobileSearch({ onClose }) {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const searchQueryNotes = useSelector((state) => state.note.searchQueryNotes);

  const handleSearchQueryNotes = function (e) {
    const query = e.target.value;
    dispatch(noteAction.allSearchQueryNotes(query));
    setSearchText(query);
  };

  const handleGoBack = function () {
    dispatch(noteAction.clearFilters());
    dispatch(noteAction.allSearchQueryNotes(''));
    setSearchText('');
    onClose();
  };

  const handleClearSearch = function () {
    dispatch(noteAction.allSearchQueryNotes(''));
    setSearchText('');
  };

  const handleSelectNote = (note) => {
    dispatch(noteAction.showNoteDetail(note));
    dispatch(mobileAction.callShowNote());
    dispatch(mobileAction.callHideSearch());
  };

  const renderTags = (tags) => {
    if (!tags) return null;
    const tagsArray = tags.split(',').filter((tag) => tag.trim());

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {tagsArray.map((tag, index) => (
          <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md text-xs text-gray-700 dark:text-gray-300">
            {tag.trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bottom-16 bg-white dark:bg-black z-40 flex flex-col">
      <div className="px-4 py-4 sm:px-8 sm:py-6 flex items-center gap-3 border-b dark:border-gray-800">
        <button className="text-gray-700 dark:text-gray-300 active:scale-95" onClick={handleGoBack}>
          <ArrowLeft />
        </button>

        <div className="flex-1 flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 px-4 py-3">
          <div className="text-black dark:text-gray-400">
            <IconSearch />
          </div>
          <input
            type="text"
            className="focus:outline-none w-full text-black dark:text-white bg-transparent placeholder-gray-800 dark:placeholder-gray-400"
            value={searchText}
            placeholder="Search by title, content, or tags…"
            onChange={handleSearchQueryNotes}
            autoFocus
          />
          {searchText && (
            <button className="text-gray-500 dark:text-gray-400 text-sm" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-8">
        {searchText ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {searchQueryNotes.length > 0
                ? `Found ${searchQueryNotes.length} result${searchQueryNotes.length !== 1 ? 's' : ''} for "${searchText}"`
                : `No results found for "${searchText}"`}
            </h2>

            {searchQueryNotes.length === 0 ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-gray-700 dark:text-gray-300">
                Try searching for different keywords or check your spelling.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {searchQueryNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSelectNote(note)}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{note.title || 'Untitled Note'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {note.created_at && format(new Date(note.created_at), 'dd MMM yyyy')}
                      {note.archived && ' • Archived'}
                    </p>
                    {note.note_details && <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{note.note_details}</p>}
                    {renderTags(note.tags)}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Search for notes</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Enter keywords to find notes by title, content, or tags</p>
          </div>
        )}
      </div>
    </div>
  );
}

MobileSearch.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MobileSearch;
