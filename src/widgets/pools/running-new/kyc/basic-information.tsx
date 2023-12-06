import { useMemo, useState } from "react"
import { Form } from "react-bootstrap"
import { CustomForm, CustomInputFormProps } from "../../../../components/custom-form/custom-form"
import countryList from "react-select-country-list"
import { useAppDispatch, useAppSelector } from "../../../../core/redux/hooks"
import { setKycData } from "../../../../core/redux/kyc"
import PhoneInput from "react-phone-input-2"
import { CustomText } from "../../../../components/custom-text"
import { UpdateProfile } from "../../../../core/redux"
import moment from "moment"

interface BasicInformationProps {
  onNext?: VoidFunction
  onBack?: VoidFunction
}

export function BasicInformation({ onBack, onNext }: BasicInformationProps) {
  const dispatch = useAppDispatch()
  const { kycData, kycResponse } = useAppSelector((state) => state.Kyc)
  const { user } = useAppSelector((state) => state.Auth)

  const initProfileValues = {
    email: user?.email ?? "",
    phone_number: user?.phone_number ?? "",
  }

  const profileInputs: CustomInputFormProps[] = [
    {
      type: "email",
      name: "email",
      label: "Your Email",
      validate: {
        required: true,
        rule: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
      colProps: { xs: 12 },
    },
    {
      type: "number",
      name: "phone_number",
      label: "Phone Number",
      colProps: { xs: 12 },
      component: (formik) => (
        <PhoneInput
          containerClass="custom-input"
          specialLabel=""
          placeholder="Phone Number"
          country={"ae"}
          value={formik.values["phone_number"]}
          onChange={(e: string) => formik.setFieldValue("phone_number", `+${e}`, true)}
          inputStyle={{ width: "100%" }}
        />
      ),
    },
  ]

  const initValues = {
    nationality: "",
    full_name: "",
    id_number: "",
    birthdate: "",
    notes: "",
  }
  // const [submitedBefore, setSubmitedBefore] = useState(false)
  const inputs: CustomInputFormProps[] = [
    {
      name: "nationality",
      label: "Nationality",
      placeholder: "Nationality",
      component: (formik) => (
        <CountrySelector
          value={formik.values["nationality"]}
          onChange={(val) => {
            formik.setFieldValue("nationality", val, true)
          }}
        />
      ),
      colProps: { xs: 12 },
      validate: { required: true },
    },
    {
      name: "full_name",
      label: "Full Name",
      colProps: { xs: 12 },
      validate: { required: true },
    },
    {
      name: "id_number",
      label: "ID No.",
      colProps: { xs: 12 },
      validate: { required: true },
    },
    {
      name: "birthdate",
      label: "Birthdate",
      colProps: { xs: 12 },
      validate: { required: true },

      component: (formik) => (
        <div className="custom-input">
          <Form.Control
            onChange={(event) => {
              formik.setFieldValue("birthdate", event.currentTarget.value, true)
            }}
            type="date"
            name="birthdate"
            placeholder="Date of Birth"
            value={formik.values["birthdate"]}
            max={moment().format("yyyy-MM-DD")}
            min={"1900-01-01"}
          />
        </div>
      ),
    },
    {
      name: "",
      component: () => (
        <ol className="mt-2">
          <li>The information can‘t be modified once it has been certified, please provide real information.</li>
          <li>Authenticated real-name information cannot be authenticated repeatedly.</li>
        </ol>
      ),
      colProps: { xs: 12 },
    },
  ]

  return (
    <div>
      {kycResponse && (
        <div className="my-2">
          <CustomText data-testid="New-kycResponse" color="error" style={{ wordBreak: "break-all" }}>
            {kycResponse.notes}
          </CustomText>
        </div>
      )}
      <CustomForm
        data-testid="New-profileInputs-KycData"
        inputs={profileInputs}
        submitLable="Update profile"
        onSubmit={(values) => {
          // setSubmitedBefore(true)
          // onNext && onNext()
          // dispatch(setKycData(values))
          if (initProfileValues.email === values.email) {
            delete values["email"]
          }
          if (initProfileValues.phone_number === values.phone_number) {
            delete values["phone_number"]
          }
          dispatch(UpdateProfile(values))
        }}
        initialInputValues={initProfileValues}
        actionsJustify={"end"}
      />
      <div className="divider-horizental my-3" />
      <CustomForm
        data-testid="New-inputs-form-KycData"
        inputs={inputs}
        submitLable="Next"
        onSubmit={(values) => {
          // setSubmitedBefore(true)
          onNext && onNext()
          dispatch(setKycData(values))
        }}
        initialInputValues={kycData ? { ...kycData, email: user?.email ?? "", phone_number: user?.phone_number ?? "" } : initValues}
        actionsJustify={"end"}
        onBack={onBack}
      />
    </div>
  )
}
function CountrySelector({ onChange, value: defaultValue }: { onChange: (value: string) => void; value: string }) {
  const [value, setValue] = useState(defaultValue)
  const options: any = useMemo(() => countryList().getData(), [])

  const changeHandler = (event: any) => {
    console.log(event.currentTarget.value)

    setValue(event.currentTarget.value)
    onChange(event.currentTarget.value)
  }

  return (
    <Form.Select data-testid="New-value-KycData" value={value} onChange={changeHandler}>
      <option data-testid="New-value-Kyc-options" value={""}>
        {"Select your nationality"}
      </option>
      {options.map((item: any) => (
        <option data-testid="New-itemvalue-Kyc-options" key={item.value} value={item.value.toLowerCase()}>
          {item.label}
        </option>
      ))}
    </Form.Select>
  )
}
