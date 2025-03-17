import { Tooltip } from "@mui/material";
import ArrowDownTrayIcon from "@heroicons/react/24/solid/ArrowDownTrayIcon";
import FileSaver from "file-saver";
import Icon from "./Icon";

function DoctorDocument({ title, document }) {
  return (
    <Tooltip title={title}>
      <Icon
        title={title}
        onClick={() => {
          FileSaver.saveAs(`/uploads/${document}`, `${document}`);
        }}
      >
        <ArrowDownTrayIcon />
      </Icon>
    </Tooltip>
  );
}
export default DoctorDocument;
