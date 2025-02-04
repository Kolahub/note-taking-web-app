import Navbar from '../components/Navbar';
import logo from '/images/logo.svg';
import NoteBars from '../components/NoteBars';
import CleanSweep from '../components/CleanSweep';
import NoteForm from '../components/NoteForm';
import { useSelector } from 'react-redux';

function Dashboard() {
  const allNotes = useSelector((state) => state.notes);
  const newNoteI = useSelector((state) => state.newNoteI);

  return (
    <div className="grid grid-cols-10 grid-rows-9 lg:h-screen">
      <div className="border-r-2 px-4 pt-3 row-span-full col-start-1 col-span-2">
        <div className="mb-4">
          <img src={logo} alt="Logo" className="w-32" />
        </div>
        <Navbar />
      </div>

      <div className="flex items-center justify-between px-8 py-[18.5px] border-b-2 col-start-3 -col-end-1 row-start-1 row-span-1">
        <h1 className="capitalize text-3xl font-bold">all notes</h1>
        <div className="flex gap-4">
          <input type="text" className="border-2 rounded-lg focus:outline-none p-2 w-[320px]" />
          <button type="button">
            <div className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M8.959 4.529A2.529 2.529 0 0 1 11.488 2h1.221a1.243 1.243 0 0 0 .035.001 2.542 2.542 0 0 1 2.458 2.602c.004.164.05.324.133.467l.003.005.002.003.003.005c.289.488.92.65 1.408.36l.01-.005a2.541 2.541 0 0 1 3.464.93v.001l.583 1.011c.015.025.028.05.039.077a2.54 2.54 0 0 1-.967 3.386l-.005.003c-.156.09-.286.22-.375.376l-.009.015-.001.002c-.28.49-.112 1.112.374 1.396l.002.002.015.008.038.023a2.528 2.528 0 0 1 .887 3.445l-.004.008-.614 1.025a2.54 2.54 0 0 1-3.46.926 1.079 1.079 0 0 0-.497-.14h-.01a1.029 1.029 0 0 0-1.019 1.034v.01a2.54 2.54 0 0 1-2.541 2.524h-1.17a2.54 2.54 0 0 1-2.54-2.536.966.966 0 0 0-.147-.498 1.023 1.023 0 0 0-1.4-.37l-.003.002a.626.626 0 0 1-.03.016 2.541 2.541 0 0 1-3.442-.993l-.578-.996a1.144 1.144 0 0 1-.018-.03 2.528 2.528 0 0 1 .938-3.447 1.041 1.041 0 0 0-.001-1.803h-.001a2.54 2.54 0 0 1-.93-3.466l.01-.015.622-1.024a2.54 2.54 0 0 1 3.46-.923l.009.005a.963.963 0 0 0 .479.135 1.04 1.04 0 0 0 1.04-1.022V4.53Zm6.386.557v.002-.002ZM11.488 3.5c-.569 0-1.029.46-1.029 1.029v.023a2.541 2.541 0 0 1-2.547 2.505h-.005a2.463 2.463 0 0 1-1.226-.34 1.04 1.04 0 0 0-1.416.382l-.009.014-.62 1.02a1.04 1.04 0 0 0 .385 1.413l-.376.65.375-.65a2.542 2.542 0 0 1 0 4.402h-.002a1.029 1.029 0 0 0-.377 1.411l.59 1.016.007.014a1.041 1.041 0 0 0 1.42.406 2.523 2.523 0 0 1 3.43.897l.003.003.013.021.002.005c.221.373.34.797.344 1.232v.007c0 .574.466 1.04 1.042 1.04h1.169a1.04 1.04 0 0 0 1.041-1.03 2.528 2.528 0 0 1 2.511-2.539h.049c.426.011.84.128 1.209.338l.003.002a1.04 1.04 0 0 0 1.419-.382l.005-.01.615-1.025a1.028 1.028 0 0 0-.382-1.41 2.528 2.528 0 0 1-.95-3.439l.022-.036a2.51 2.51 0 0 1 .925-.923 1.04 1.04 0 0 0 .38-1.413.71.71 0 0 1-.032-.06l-.55-.953a1.041 1.041 0 0 0-1.415-.383 2.527 2.527 0 0 1-3.457-.887l-.003-.005-.002-.003c0-.002-.002-.003-.003-.005a2.464 2.464 0 0 1-.343-1.262 1.042 1.042 0 0 0-1-1.074h-.032l-.01-.001h-1.173ZM6.623 16.815l.002-.001-.002.001Zm5.455-6.785a1.717 1.717 0 1 0 0 3.434 1.717 1.717 0 0 0 0-3.434Zm-3.217 1.718a3.217 3.217 0 1 1 6.434-.001 3.217 3.217 0 0 1-6.434.001Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="col-start-3 col-span-2 row-start-2 row-span-full">
        <NoteBars />
      </div>

      <div className="col-start-5 col-span-4 row-start-2 row-span-full">
        {(newNoteI || allNotes.length > 0) && <NoteForm />}
      </div>

      <div className="-col-end-1 col-span-2 row-start-2 row-span-full">
        {allNotes.length > 0 && <CleanSweep />}
      </div>
    </div>
  );
}

export default Dashboard;