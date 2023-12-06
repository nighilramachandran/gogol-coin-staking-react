import React, { ReactNode, useMemo } from "react"
import { FormikProps, useFormik } from "formik"
import { RequestStatus } from "../../utils/constants"
import { CustomInput, CustomInputProps } from "../custom-input"
import { CustomButton } from "../custom-button"
import { Row, Col, ColProps } from "react-bootstrap"
import { CustomSpace } from "../custom-space"
import { CustomText } from "../custom-text"
import { useMatch } from "react-router-dom"

interface InputValidation {
  required: boolean
  rule?: RegExp
  rule_message?: string
  same?: string
}

type ComponentReturnType = ReactNode | ReactNode[]
//custom-input props
export type CustomInputFormProps = CustomInputProps & {
  validate?: InputValidation
  component?: (formik: FormikProps<any>) => ComponentReturnType
  colProps?: ColProps
}

interface props {
  inputs: CustomInputFormProps[]
  onSubmit: (data: any) => void
  submitWhenDirty?: boolean
  status?: RequestStatus
  submitLable?: string
  initialInputValues?: any
  resetFrom?: boolean
  deleteButton?: boolean
  auth?: boolean
  labels?: string
  onCancel?: () => void
  onBack?: VoidFunction
  actionsJustify?: "center" | "start" | "end" | "between"
}

export const CustomForm: React.FC<props> = ({
  inputs = [],
  onSubmit,
  status,
  submitLable = "Submit",
  initialInputValues,
  resetFrom,
  onCancel,
  onBack,
  actionsJustify = "center",
  submitWhenDirty = true,
  ...restProps
}) => {
  let { formValidate, initialValues } = useMemo(() => {
    // Define formik values
    let initValues: any = {}
    //for each input in form set : initial Value
    if (!initialInputValues)
      inputs.forEach((input) => {
        if (!input.ignore) {
          if (input.type === "checkbox") {
            initValues[input.name] = false
          } else initValues[input.name] = ""
        }
      })
    else {
      inputs.forEach((input) => {
        if (!input.ignore) initValues[input.name] = initialInputValues[input.name]
      })
    }

    //for each input in form set : error value
    let validate: (data: any) => any = (data: any) => {
      let errors: any = {}
      inputs.forEach((input) => {
        const fieldName = input.label && typeof input.label ? input.label : input.name
        switch (input.name) {
          case "confirmPassword":
            if (!data.confirmPassword) {
              errors.confirmPassword = "Confirm Password is required."
            } else if (data.confirmPassword !== data.password) {
              errors.confirmPassword = "Confirm Password does not match."
            }
            break
          default:
            if (input.validate?.required) {
              if (!data[input.name]) {
                errors[input.name] = `${fieldName} is required`
              } else if (input.validate.rule && !input?.validate?.rule?.test(data[input.name])) {
                errors[input.name] = input.validate.rule_message ?? `Invalid ${fieldName}`
              }
            }
            if (input.validate?.same) {
              if (data[input.name] !== data[input.validate.same]) {
                errors[input.name] = `${fieldName} does not match.`
              }
            }
            break
        }
      })
      return errors
    }
    return {
      initialValues: initValues,
      formValidate: validate,
    }
  }, [inputs, initialInputValues])

  const formik = useFormik({
    initialValues: initialValues,
    validate: formValidate,
    onSubmit: async (data: any) => {
      onSubmit(data)
      if (resetFrom) formik.resetForm()
    },
  })

  const isFormFieldValid = (name: string) => !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name: string) => (isFormFieldValid(name) ? formik.errors[name] : "")

  const matchLogin = useMatch("/login")
  const matchRegister = useMatch("/register")
  const match = !matchLogin && !matchRegister

  return (
    <form onSubmit={formik.handleSubmit} {...restProps}>
      <Row className="justify-content-center g-4" data-testid="custom-form">
        {inputs.map(({ name, component, label, colProps, placeholder, ...restInputProps }) => (
          <Col key={name} {...colProps}>
            {!component ? (
              <CustomInput
                data-testid={`$text-${name}`}
                key={name}
                name={name}
                {...restInputProps}
                label={label}
                placeholder={placeholder ?? (label as any)}
                value={formik.values[name]}
                onChange={formik.handleChange}
                errorMessage={getFormErrorMessage(name)}
              />
            ) : (
              <>
                {match && (
                  <CustomText color="gray" className="ml-4">
                    {placeholder ?? label}
                  </CustomText>
                )}
                <div className="my-1">{component(formik)}</div>
                {getFormErrorMessage(name) && (
                  <CustomText en color="error" className="mx-4">
                    {getFormErrorMessage(name) as string}
                  </CustomText>
                )}
              </>
            )}
          </Col>
        ))}
        {/*  submit */}

        <Col style={{ textAlign: "center" }}>
          <CustomSpace fill justify={(onCancel || onBack) && !actionsJustify ? "between" : actionsJustify}>
            {onCancel && (
              <CustomButton data-testid="Cancel-custom-btn-form" bg="primary" disabled={status === "loading"} onClick={onCancel}>
                Cancel
              </CustomButton>
            )}
            {onBack && (
              <CustomButton data-testid="Back-custom-btn-form" bg="primary" disabled={status === "loading"} onClick={onBack}>
                Back
              </CustomButton>
            )}

            <CustomButton
              // data-testid="custom-submit-lable"
              data-testid={`$btn-submit`}
              // style={{ width: "100%" }}
              type="submit"
              disabled={status === "loading" || (!submitWhenDirty && !formik.dirty)}
            >
              {submitLable}
            </CustomButton>
          </CustomSpace>
        </Col>
      </Row>
    </form>
  )
}
