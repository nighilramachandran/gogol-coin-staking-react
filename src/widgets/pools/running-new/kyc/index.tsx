import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepButton from "@mui/material/StepButton"
import { BasicInformation } from "./basic-information"
import { UploadFiles } from "./upload-files"
import { Col, Row } from "react-bootstrap"
import { ReviewKYC } from "./review-kyc"
import { useBreakpoints } from "../../../../utils/hooks"
import { CustomText } from "../../../../components/custom-text"
import { useAppDispatch, useAppSelector } from "../../../../core/redux/hooks"
import { CreateUserInfoAsync, UpdateUserInfoAsync } from "../../../../core/redux/kyc"

const steps = ["Basic Information", "Upload ID photo", "Review Your Application"]

export const TransferForm: React.FC<{ toggleModal: () => void }> = ({ toggleModal: hideModal }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  const { kycData, kycResponse } = useAppSelector((state) => state.Kyc)
  const dispatch = useAppDispatch()

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleComplete = () => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  const handleSubmit = () => {
    if (kycData) {
      if (kycResponse) dispatch(UpdateUserInfoAsync(kycData))
      else dispatch(CreateUserInfoAsync(kycData))
    }
    hideModal()
  }

  const { md } = useBreakpoints()

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper data-testid="New-activeStep" activeStep={activeStep}>
        {md ? (
          steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))
        ) : (
          <CustomText data-testid="New-steps-activeStep" color="primary" className="ms-5" fs={2}>
            {steps[activeStep]}
          </CustomText>
        )}
      </Stepper>
      <div>
        <React.Fragment>
          <Row className="justify-content-center my-4 py-4" style={{ height: "60vh", overflow: "scroll" }}>
            <Col data-testid="New-status-activeStep" xs={10}>
              {activeStep === 0 && <BasicInformation onNext={handleNext} />}
              {activeStep === 1 && <UploadFiles onBack={handleBack} onNext={handleNext} />}
              {activeStep === 2 && <ReviewKYC onBack={handleBack} onNext={handleSubmit} />}
            </Col>
          </Row>
          {/*  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <CustomButton bg="outline" color="inherit" disabled={activeStep === 0} onClick={handleBack} style={{ marginRight: 1 }}>
              Back
            </CustomButton>
            <Box sx={{ flex: "1 1 auto" }} />
            <CustomButton bg="outline" onClick={handleNext} style={{ marginRight: 10 }}>
              Next
            </CustomButton>
           {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <CustomText style={{ display: "inline-block" }}>Step {activeStep + 1} already completed</CustomText>
                ) : (
                  <CustomButton onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Finish" : "Complete Step"}</CustomButton>
                ))} 
          </Box>*/}
        </React.Fragment>
      </div>
    </Box>
  )
}
