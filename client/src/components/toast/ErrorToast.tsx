import { OctagonAlert } from "lucide-react";

function ErrorToast({ error }: { error: string }) {
  return  (
    <div className={`absolute top-10 bg-black ${error.length == 0 ? "hidden" : "right-10"} text-white w-64 border-b-4 border-red-500 rounded-xl  p-2`}>
      <div className="flex items-center ">
        <h1 className="mr-2 text-red-500">
          <OctagonAlert />
        </h1>
        <h1>{error}</h1>
      </div>
    </div>
  );
}

export default ErrorToast;
