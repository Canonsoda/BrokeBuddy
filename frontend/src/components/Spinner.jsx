import Lottie from "lottie-react";
import Loaded from "../assets/animations/Loaded.json";

const Spinning = ({ className = "w-28 h-28" }) => {
  return (
    <div className="flex justify-center items-center py-8">
      <Lottie animationData={Loaded} loop className={className} />
    </div>
  );
};

export default Spinning;
