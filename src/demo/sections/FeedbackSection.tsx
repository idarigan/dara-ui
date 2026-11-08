import { useState } from "react";
import { Button, Modal, useI18n, usePageLoader, useToast } from "../../index";
import { Preview, Section } from "../Section";

export const FeedbackSection = () => {
  const { t } = useI18n();
  const toast = useToast();
  const loader = usePageLoader();
  const [isOpen, setIsOpen] = useState(false);

  const simulateRoute = () => {
    loader.show({
      label: t("pageLoader.navigating"),
      shape: "spinner",
      showBrand: true,
      minDuration: 600,
    });
    setTimeout(() => loader.hide(), 1800);
  };

  const simulateFetch = () => {
    loader.wrap(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1600));
      },
      { label: t("pageLoader.fetchingData"), shape: "dots" },
    );
  };

  return (
    <Section
      id="feedback"
      title="Feedback"
      description="Toasts, modals and loaders that react to what the user just did."
    >
      <Preview
        title={t("toast.title")}
        code={`const toast = useToast();\ntoast.success("Mission complete!");`}
      >
        <Button
          variant="success"
          onClick={() => toast.success(t("toast.successMsg"))}
        >
          {t("toast.successToast")}
        </Button>
        <Button
          variant="danger"
          onClick={() => toast.error(t("toast.errorMsg"))}
        >
          {t("toast.errorToast")}
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning(t("toast.warningMsg"))}
        >
          {t("toast.warningToast")}
        </Button>
        <Button variant="glass" onClick={() => toast.info(t("toast.infoMsg"))}>
          {t("toast.infoToast")}
        </Button>
      </Preview>

      <Preview title={t("modal.title")}>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          {t("modal.openModal")}
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={t("modal.archiveAccess")}
          confirmText={t("modal.acceptMission")}
          cancelText={t("modal.decline")}
        >
          {t("modal.modalDescription")}
        </Modal>
      </Preview>

      <Preview title={t("pageLoader.title")}>
        <Button variant="primary" onClick={simulateRoute}>
          {t("pageLoader.simulateRoute")}
        </Button>
        <Button variant="secondary" onClick={simulateFetch}>
          {t("pageLoader.simulateFetch")}
        </Button>
      </Preview>
    </Section>
  );
};
