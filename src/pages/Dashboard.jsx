import Navbar from '../components/Navbar';
import logo from '/images/logo.svg';
import NoteBars from '../components/NoteBars';
import CleanSweep from '../components/CleanSweep';
import NoteForm from '../components/NoteForm';
import { useSelector } from 'react-redux';
import SubNav from '../components/SubNav';
import Settings from '../components/Settings';

function Dashboard() {
  const allNotes = useSelector((state) => state.notes);
  const newNoteI = useSelector((state) => state.newNoteI);
  const settingsActive = useSelector((state) => state.settingsActive);

  return (
    <div className="grid grid-cols-10 grid-rows-9 lg:h-screen">
      <div className="border-r-2 px-4 pt-3 row-span-full col-start-1 col-span-2">
        <div className="mb-4">
          <img src={logo} alt="Logo" className="w-32" />
        </div>
        <Navbar />
      </div>

      <div className="border-b-2 col-start-3 -col-end-1 row-start-1 row-span-1">
        <SubNav />
      </div>

      <div className="col-start-3 col-span-2 row-start-2 row-span-full">
        <NoteBars />
      </div>

      <div className="col-start-5 col-span-4 row-start-2 row-span-full">
        {settingsActive ? <Settings /> : (newNoteI || allNotes.length > 0) && <NoteForm />}
      </div>

      <div className="-col-end-1 col-span-2 row-start-2 row-span-full">{settingsActive ? null : allNotes.length > 0 && <CleanSweep />}</div>
    </div>
  );
}

export default Dashboard;
