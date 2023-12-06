import React from "react"
import { Column } from "react-table"
import { CustomInputFormProps } from "../../components/custom-form/custom-form"
import { CustomTableKyc } from "../../components/custom-table-kyc"
import { KYC } from "../../core/models"
import { RequestStatus } from "../../utils/constants"

interface props {
  inputs: CustomInputFormProps[]
  // data: KYC[]
  data: any
  title: string
  status: RequestStatus
  onAccept?: (vals: any) => void
  onReject?: (vals: any) => void
  onBan?: (vals: any) => void
  onUnBan?: (vals: any) => void
  reFetch: () => void
  nextPage?: () => void
  prevPage?: () => void
  gotoPage?: (page: number) => void
  onSearch?: (search: string) => void
  total_pages?: number
  page?: number
}

export const CRUDBuilderKyc: React.FC<props> = ({ inputs, title, ...rest }) => {
  const getColumns = (id: string): Column[] => [
    {
      id,
      Header: id,
      columns: inputs.map((el) => ({ id: el.name, Header: el.label, accessor: el.accessor ?? el.name, width: "10%" })),
    },
  ]

  return <CustomTableKyc data-testid="table-crud-builderkyc" columns={getColumns(title!)} inputs={inputs} title={title} {...rest} />
}
