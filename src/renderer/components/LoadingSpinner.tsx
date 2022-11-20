import { ThreeDots } from  'react-loader-spinner'

interface LoadingSpinnerProps {
  visible: boolean;
};

const LoadingSpinner = ({ visible } : LoadingSpinnerProps) => {
  return (
    <ThreeDots
      height="60"
      width="60"
      radius="9"
      color="#ffffff"
      wrapperStyle={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "50%"
      }}
      visible={visible}
    />
  );
};

export default LoadingSpinner;
