import React, { useEffect, useState } from "react"
import { Form, InputGroup } from "react-bootstrap"
import { Button } from "react-bootstrap/lib/InputGroup"
import { useMatch } from "react-router-dom"
import { useBreakpoints } from "../../utils/hooks"
import { CustomText } from "../custom-text"
import EyeIcon from "./EyeIcon"
import EyeSlashIcon from "./EyeSlashIcon"

type InputType = "text" | "password" | "email" | "checkbox" | "number"

interface CustomInputAttributes {
  type?: InputType
  name: string
  label?: string | React.ReactElement
  icon?: string
  auth?: boolean
  ignore?: boolean
  errorMessage?: any
  accessor?: string | ((row: any) => any)
}

export type CustomInputProps = CustomInputAttributes &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const CustomInput: React.FC<CustomInputProps> = ({ type: inputType, errorMessage, label, ...rest }) => {
  const [type, setType] = useState(inputType)
  // show label above the input just inside dashboard routes
  const matchLogin = useMatch("/login")
  const matchRegister = useMatch("/register")
  const match = !matchLogin && !matchRegister

  const { md } = useBreakpoints()

  const handleShowPassword = () => {
    setType(type === "text" ? "password" : "text")
  }

  useEffect(() => {
    type === "checkbox" && console.log(`value`, Boolean(rest.value))
  }, [rest.value])

  return type === ("checkbox" as any) ? (
    <InputGroup className={type} data-testid="custom-input">
      <Form.Check id={`default-${type}`} checked={rest.value} label={(rest as any).placeholder} {...(rest as any)} className="w-100" />
      <CustomText en color="error" data-testid="error-msg-custom-input" className="mx-4">
        {errorMessage}
      </CustomText>
    </InputGroup>
  ) : (
    <div className="custom-input">
      {match && (
        <CustomText color="gray" className="ml-4">
          {label}
        </CustomText>
      )}
      <div className="position-relative">
        <input type={type} className="my-1" {...rest} />
        {inputType === "password" && (
          <div
            onClick={handleShowPassword}
            // className="position-fixed"
            className="position-absolute"
            // style={{ color: "gray", right: md ? "20%" : "10%", marginTop: "-45px", cursor: "pointer" }}
            style={{ color: "gray", right: "2%", marginTop: "-45px", cursor: "pointer" }}
          >
            {type === "text" ? <EyeSlashIcon /> : <EyeIcon />}
          </div>
        )}
      </div>

      {errorMessage && (
        <CustomText data-testid={`$text-${errorMessage}`} en color="error" className="mx-4">
          {errorMessage}
        </CustomText>
      )}
    </div>
  )
}
