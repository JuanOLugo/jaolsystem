import { OctagonAlert } from "lucide-react";

function SuccessToast({ success }: { success: string }) {
  return  (
    <div className={`absolute top-10 bg-black ${success.length == 0 ? "hidden" : "right-10"} text-white w-64 border-b-4 border-emerald-500 rounded-xl  p-2`}>
      <div className="flex items-center ">
        <h1 className="mr-2 text-emerald-500">
          <OctagonAlert />
        </h1>
        <h1>{success}</h1>
      </div>
    </div>
  );
}

export default SuccessToast;
