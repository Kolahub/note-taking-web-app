// import React from 'react'

import { useDispatch, useSelector } from "react-redux";
import supabase from "../config/SupabaseConfig";
import { noteAction } from "../store";

function CleanSweep() {
  const noteDetail = useSelector((state) => state.noteDetail);
  const dispatch = useDispatch()
  

  const handleDeleteNow = async function () {
    const {data, error} = await supabase
    .from('notes')
    .delete()
    .eq('id', noteDetail.id)
    .select()

    if(error) console.log(error)

      if(data) {
        console.log(data)
        dispatch(noteAction.deleteNote(noteDetail.id))
      };
      
   }
  return (
    <div className="flex flex-col gap-3 pl-4 py-5 mr-6 h-full">
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 w-full rounded-lg active:scale-95">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="#0E121B"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 7.782v8.435C21 19.165 18.919 21 15.974 21H8.026C5.081 21 3 19.165 3 16.216V7.782C3 4.834 5.081 3 8.026 3h7.948C18.919 3 21 4.843 21 7.782Z"
          />
          <path
            stroke="#0E121B"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m15 14-3.002 3L9 14M11.998 17v-7M20.934 7H3.059"
          />
        </svg>
        <p className="capitalize">archive notes</p>
      </button>
      <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 w-full rounded-lg active:scale-95" onClick={handleDeleteNow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          fill="none"
          viewBox="0 0 24 25"
        >
          <path
            stroke="#0E121B"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m14.852 3.879.818 1.785h2.64c.811 0 1.47.658 1.47 1.47V8.22c0 .555-.45 1.005-1.006 1.005H5.005C4.45 9.226 4 8.776 4 8.221V7.133c0-.811.658-1.47 1.47-1.47h2.639l.818-1.784c.246-.536.78-.879 1.37-.879h3.185c.59 0 1.125.343 1.37.879ZM18.24 9.3v8.686c0 1.665-1.333 3.014-2.977 3.014H8.517c-1.644 0-2.977-1.349-2.977-3.014V9.301M10.2 12.816v4.509m3.38-4.509v4.509"
          />
        </svg>
        <p className="capitalize">delete notes</p>
      </button>
    </div>
  );
}

export default CleanSweep;
