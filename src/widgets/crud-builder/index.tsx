import React from "react"
import { Column } from "react-table"
import { CustomInputFormProps } from "../../components/custom-form/custom-form"
import { CustomTable } from "../../components/custom-table"
import { WithDrawHistory } from "../../core/models"
import { RequestStatus } from "../../utils/constants"

interface props {
  inputs: CustomInputFormProps[]
  data: any
  title?: string
  status?: RequestStatus
  onUpdate?: (vals: any) => void
  onDelete?: (vals: any) => void
  onInsert?: (vals: any) => void
  onActive?: (vals: any) => void
  onRestore?: (vals: any) => void
  onDeActive?: (vals: any) => void
  onSendGols?: (vals: WithDrawHistory) => void
  onChangeToGolc?: (vals: any) => void
  onChangeRole?: (vals: any) => void
  // onDelete?: (vals: any) => void
  nextPage?: () => void
  prevPage?: () => void
  gotoPage?: (page: number) => void
  onSearch?: (search: string) => void
  reFetch: () => void
  total_pages?: number
  page?: number
}

export const CRUDBuilder: React.FC<props> = ({ inputs, title, ...rest }) => {
  const getColumns = (id: string): Column[] => [
    {
      id,
      Header: id,
      columns: inputs.map((el) => ({ id: el.name, Header: el.label, accessor: el.accessor ?? el.name, width: "10%" })),
    },
  ]

  return <CustomTable data-testid="table-crud-builder" columns={getColumns(title!)} inputs={inputs} title={title} {...rest} />
}
