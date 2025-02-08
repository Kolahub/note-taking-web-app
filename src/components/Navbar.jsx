import { NavLink, useLocation } from "react-router-dom";
import arrowLeft from "/images/icon-arrow-left.svg";
import { useDispatch, useSelector } from "react-redux";
import { noteAction } from "../store";
import Tags from "./Tags";
import { useEffect } from "react";

function Navbar() {
  const newNoteI = useSelector((state) => state.newNoteI);

  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const archiveNotePath = currentPath === '/archive-notes';
  const allNotePath = currentPath === '/' || currentPath === '/all-notes';

  useEffect(() => {
    if (newNoteI && archiveNotePath) {
      // delay the cancel dispatch a little bit to allow the navigation to complete.
      const timer = setTimeout(() => {
        dispatch(noteAction.cancelNote());
      }, 100); // 100ms delay (adjust as necessary)
      return () => clearTimeout(timer);
    }
  }, [newNoteI, archiveNotePath, dispatch]);

  useEffect(() => {
    dispatch(noteAction.clearFilters())
  }, [dispatch])
  

  return (
    <div>
      <div className="lg:mt-4 lg:flex flex-col gap-2">
        <NavLink
          to={"all-notes"}
          end
          onClick={() => dispatch(noteAction.clearFilters())}
          className={`flex justify-between w-full px-3 py-[10px] rounded-lg group hover:bg-gray-200 ${
            allNotePath ? "bg-gray-200 text-blue-500" : ""
          }`}
        >
          <div className="flex gap-2">
            <div className="group-hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.496 8.025a.75.75 0 0 1 .75.75v8.675a2.314 2.314 0 0 0 2.314 2.314h8.88a2.314 2.314 0 0 0 2.313-2.314V8.775a.75.75 0 0 1 1.5 0v8.675a3.814 3.814 0 0 1-3.814 3.814H7.56a3.814 3.814 0 0 1-3.814-3.814V8.775a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M10.06 3.41a3.127 3.127 0 0 1 3.88 0l7.525 5.958a.75.75 0 1 1-.93 1.176l-7.526-5.957a1.628 1.628 0 0 0-2.018 0l-7.525 5.957a.75.75 0 1 1-.931-1.176L10.06 3.41Z"
                  clipRule="evenodd"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M17.668 4.193a.75.75 0 0 1 .75.75v2.354a.75.75 0 0 1-1.5 0V4.943a.75.75 0 0 1 .75-.75ZM11.974 13.688h.055c.377 0 .702 0 .97.02.283.022.565.071.838.203a2.25 2.25 0 0 1 1.05 1.05c.131.272.18.554.202.837.02.268.02.593.02.97v3.746a.75.75 0 0 1-1.5 0v-3.718c0-.412 0-.678-.015-.881-.016-.195-.041-.268-.059-.303a.75.75 0 0 0-.35-.35c-.035-.017-.108-.043-.302-.058a12.747 12.747 0 0 0-.881-.017c-.412 0-.679.001-.881.017-.195.015-.268.04-.303.058a.75.75 0 0 0-.35.35c-.017.035-.043.108-.058.303-.016.203-.016.469-.016.88v3.72a.75.75 0 0 1-1.5 0v-3.747c0-.377 0-.702.02-.97.022-.283.071-.565.203-.838a2.25 2.25 0 0 1 1.05-1.05c.273-.131.554-.18.837-.202.268-.02.593-.02.97-.02Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-950">All Notes</span>
          </div>

          <div>
            <img src={arrowLeft} alt="" className="rotate-180" />
          </div>
        </NavLink>

        <NavLink
          to="archive-notes"
          end
          className={({ isActive }) =>
            `flex justify-between w-full px-3 py-[10px] rounded-lg group hover:bg-gray-200 active:scale-95 ${
              isActive ? "bg-gray-200 text-blue-500" : ""
            }`
          }
        >
          <div className="flex gap-2">
            <div className="group-hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 7.782v8.435C21 19.165 18.919 21 15.974 21H8.026C5.081 21 3 19.165 3 16.216V7.782C3 4.834 5.081 3 8.026 3h7.948C18.919 3 21 4.843 21 7.782Z"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="m15 14-3.002 3L9 14M11.998 17v-7M20.934 7H3.059"
                />
              </svg>
            </div>
            <span className="text-gray-950">Archived Notes</span>
          </div>

          <div>
            <img src={arrowLeft} alt="" className="rotate-180" />
          </div>
        </NavLink>
      </div>

      <div className="">
        <Tags />
      </div>
    </div>
  );
}

export default Navbar;
