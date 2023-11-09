import Card from "components/card";
import { Chip } from "@material-tailwind/react";

const NftCard = ({ title, status, desc, image, extra }) => {
  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div className="relative w-full">
          <img
            src={image}
            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
            alt=""
          />
        </div>

        <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {" "}
              {title}{" "}
            </p>

            <div className="flex flex-row mt-2 items-center">
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                Status :
              </p>
              <div className={`rounded-full text-xl mx-2`}>
                {status === "Available" ? (
                  <Chip color="green" value={status} className="py-1"/>
                ) : status === "In Use" ? (
                  <Chip color="red" value={status} className="py-1"/>
                ) : null}
              </div>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
              {desc}{" "}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col 2xl:items-start 3xl:flex-row 3xl:items-center 3xl:justify-between">
          <button
            href=""
            className="linear rounded-[12px] bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
          >
            Borrow
          </button>
        </div>
      </div>
    </Card>
  );
};

export default NftCard;
