import { toast } from "./ToastConfigurator"

export const ApiErrorNotification = async (error: any) => {
  console.error(error)
  toast.success("successss")
}
