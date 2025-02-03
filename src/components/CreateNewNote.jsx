import { useSelector } from "react-redux";
import { Form } from "react-router-dom";
import supabase from "../config/SupabaseConfig";

function CreateNewNote() {
  const newNoteI = useSelector((state) => state.newNoteI);

  const handleCreateNoteSave = async function (e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const formData = Object.fromEntries(form.entries());
    console.log(formData);

    const {data, error} = await supabase
    .from('notes')
    .insert([{
      title: formData.title,
      tags: formData.tags,
      note_details: formData.noteDetails
    }])

    if (error) console.log(error)

    if (data) {
      console.log(data)
      e.target.reset();
    }
  }

  return (
    newNoteI && (
      <Form onSubmit={(e) => handleCreateNoteSave(e)}
        className="px-6 py-5 flex flex-col border-r-2 border-gray-200"
        style={{ height: "calc(100vh - 85px)" }}
      >
        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Enter a title..."
          className="focus:outline-none placeholder-black text-3xl font-bold w-full"
        />

        {/* Main Content Container */}
        <div className="mt-4 flex flex-col flex-1">
          {/* Upper Section: Tags and Last Edited */}
          <div>
            <div className="flex gap-2 py-1">
              <div className="flex items-center gap-[6px] w-[165px]">
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
                    strokeWidth="1.8"
                    d="M3.016 5.966c.003-1.411 1.07-2.677 2.456-2.916.284-.05 3.616-.042 4.995-.041 1.364 0 2.527.491 3.49 1.452 2.045 2.042 4.088 4.085 6.128 6.13 1.208 1.21 1.224 3.066.022 4.28a805.496 805.496 0 0 1-5.229 5.228c-1.212 1.201-3.069 1.186-4.279-.022-2.064-2.058-4.127-4.115-6.182-6.182-.795-.8-1.264-1.766-1.368-2.895-.084-.903-.035-4.26-.033-5.034Z"
                    clipRule="evenodd"
                  />
                  <path
                    stroke="#0E121B"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9.907 8.315a1.607 1.607 0 0 1-1.61 1.583c-.872-.002-1.599-.73-1.594-1.596a1.604 1.604 0 0 1 1.633-1.607c.864.003 1.575.736 1.571 1.62Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>Tags</p>
              </div>
              <input
                type="text"
                name="tags"
                placeholder="Add tags separated by commas (e.g. Work, Planning)"
                className="focus:outline-none w-full"
              />
            </div>

            <div className="flex gap-2 mt-2 py-1">
              <div className="flex items-center gap-[6px] w-[165px]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.2505 3.75C7.69378 3.75 4.00049 7.44329 4.00049 12C4.00049 16.5558 7.69384 20.25 12.2505 20.25C16.8072 20.25 20.5005 16.5558 20.5005 12C20.5005 7.44329 16.8072 3.75 12.2505 3.75ZM2.50049 12C2.50049 6.61487 6.86536 2.25 12.2505 2.25C17.6356 2.25 22.0005 6.61487 22.0005 12C22.0005 17.3841 17.6357 21.75 12.2505 21.75C6.8653 21.75 2.50049 17.3841 2.50049 12Z"
                    fill="#2B303B"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.9224 7.82666C12.3366 7.82666 12.6724 8.16245 12.6724 8.57666V12.2493L15.4819 13.9283C15.8375 14.1408 15.9535 14.6013 15.741 14.9569C15.5285 15.3124 15.068 15.4284 14.7124 15.2159L11.5376 13.3186C11.3111 13.1832 11.1724 12.9388 11.1724 12.6748V8.57666C11.1724 8.16245 11.5082 7.82666 11.9224 7.82666Z"
                    fill="#2B303B"
                  />
                </svg>
                <p>Last edited</p>
              </div>
              <input
                type="text"
                placeholder="Not yet saved"
                disabled
                className="focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t-2 border-gray-200 my-4"></div>

          {/* Middle Section: Textarea & Footer */}
          <div className="flex flex-col flex-1">
            {/* Textarea takes up remaining space */}
            <textarea
              name="noteDetails"
              placeholder="Start typing your note here…"
              style={{
                overflow: "auto",
                resize: "none",
                WebkitOverflowScrolling: "touch",
              }}
              className="w-full flex-1 focus:outline-none hide-scrollbar"
            />

            {/* Divider above footer */}
            <div className="w-full border-t-2 border-gray-200 my-4"></div>

            {/* Footer with Save/Cancel */}
            <div className="w-full">
              <div className="flex gap-4">
                <button type="submit" className="capitalize text-white bg-blue-500 rounded-lg px-4 py-3 active:scale-95">
                  save note
                </button>
                <button className="capitalize bg-gray-100 rounded-lg px-4 py-3 active:scale-95">
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  );
}

export default CreateNewNote;
