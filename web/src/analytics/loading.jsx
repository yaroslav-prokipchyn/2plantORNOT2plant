import { Spin } from "antd";
import { useSelector } from "react-redux";

export const Loading = () => {
  const { pdfLoading } = useSelector((state) => state.form);
  if (!pdfLoading) {
    return null;
  }
  return <Spin size="large" fullscreen />;
};
