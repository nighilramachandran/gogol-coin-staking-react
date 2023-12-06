import moment from "moment"
import React, { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { CustomImageViewer } from "../../../components/custom-image-viewer/CustomImageViewer"
import { CustomText } from "../../../components/custom-text"
import { KYC } from "../../../core/models"
import { AcceptAdminKYCAsync, RejectAdminKYCAsync, FetchAdminPendingKYCsAsync, BanAdminKYCAsync } from "../../../core/redux/dashboard/kyc"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { CRUDBuilderKyc } from "../../../widgets/crud-builder-kyc"

import "../index.scss"
import { UserInfoModal } from "../kyc"

export const PendingKYCs: React.FC = () => {
  const dispatch = useAppDispatch()
  const [showModal, setshowModal] = useState(null)
  const { pendingKycs, status } = useAppSelector((state) => state.AdminKycs)
  const { permessions } = useAppSelector((state) => state.Auth)

  const kyc_inputs: CustomInputFormProps[] = [
    {
      type: "text",
      name: "id",
      label: "ID",
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "user_id",
      label: "User ID",
      accessor: (row: any) => (
        <CustomText color="gold" onClick={() => setshowModal(row.user)}>
          {row.user_id}
        </CustomText>
      ),
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "id_number",
      label: "ID Number",
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "id_image_back",
      label: "Image Back",
      accessor: (row: KYC) => <CustomImageViewer row={row} src_key="id_image_back" />,
      ignore: true,
    },
    {
      type: "text",
      name: "id_image_front",
      label: "Image Front",
      accessor: (row: KYC) => <CustomImageViewer row={row} src_key="id_image_front" />,
      ignore: true,
    },
    {
      type: "text",
      name: "selfie_with_id",
      label: "Selfie With ID",
      accessor: (row: KYC) => <CustomImageViewer row={row} src_key="selfie_with_id" />,
      ignore: true,
    },
    {
      type: "text",
      name: "id_image_other",
      label: "Image Other",
      accessor: (row: KYC) => row.id_image_other && <CustomImageViewer row={row} src_key="id_image_other" />,
      ignore: true,
    },
    {
      type: "text",
      name: "full_name",
      label: "Full Name",
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "user",
      label: "User Email",
      accessor: (row) => row?.user?.email,
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "birthdate",
      label: "Birthdate",
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "nationality",
      label: "Nationality",
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "status",
      label: "Status",
      colProps: { xs: 12 },
      ignore: true,
    },
    {
      type: "text",
      name: "note",
      label: "Note",
      colProps: { xs: 12 },
      ignore: false,
      validate: { required: true },
    },
    {
      type: "text",
      name: "created_at",
      label: "Created At",
      accessor: (row: any) => moment(row.created_at).format("YYYY-MM-DD hh:mm:ss"),
      ignore: true,
    },
    {
      type: "text",
      name: "updated_at",
      label: "Updated At",
      accessor: (row: any) => moment(row.updated_at).format("YYYY-MM-DD hh:mm:ss"),
      ignore: true,
    },
  ]

  useEffect(() => {
    dispatch(FetchAdminPendingKYCsAsync())
  }, [])

  return (
    <Row className="px-3 g-0" data-testid="row-PendingKYCs">
      <UserInfoModal showModal={showModal} setshowModal={() => setshowModal(null)} />
      <Col>
        <CustomCard data-testid="card-pendingkycs" dashboard>
          <CRUDBuilderKyc
            data-testid="table-PendingKYCs"
            inputs={kyc_inputs}
            title={"Pending KYC"}
            data={pendingKycs.data}
            status={status}
            onAccept={permessions.isKyc ? (id: number) => dispatch(AcceptAdminKYCAsync({ id })) : undefined}
            onReject={permessions.isKyc ? (req: { id: number; note: string }) => dispatch(RejectAdminKYCAsync(req)) : undefined}
            onBan={permessions.isKyc ? (req: { id: number; note: string }) => dispatch(BanAdminKYCAsync(req)) : undefined}
            reFetch={() => dispatch(FetchAdminPendingKYCsAsync())}
            nextPage={() => dispatch(FetchAdminPendingKYCsAsync({ page: Number(pendingKycs.page) + 1 }))}
            prevPage={() => dispatch(FetchAdminPendingKYCsAsync({ page: Number(pendingKycs.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchAdminPendingKYCsAsync({ page }))}
            page={Number(pendingKycs.page)}
            total_pages={Number(pendingKycs.total_pages)}
            onSearch={(search: string) => dispatch(FetchAdminPendingKYCsAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}
