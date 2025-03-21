import { ControlItemType } from "@/types";
import { Button } from "../ui/button";
import FormControls from "./form-controls";

interface CommonFormProps {
    handleSubmit: any;
    buttonText?: string;
    formControls?: ControlItemType[];
    formData: any;
    setFormData: any;
    isButtonDisabled?: boolean;
}

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
} : CommonFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button disabled={isButtonDisabled} type="submit" className="mt-5 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;