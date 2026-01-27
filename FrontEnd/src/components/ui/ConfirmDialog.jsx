import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  open,
  title = "Confirm Action",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel?.()}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-gray-600 text-sm">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-gray-100 text-gray-900 hover:bg-gray-200"
            disabled={isLoading}
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className={
              isDestructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
            disabled={isLoading}
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
