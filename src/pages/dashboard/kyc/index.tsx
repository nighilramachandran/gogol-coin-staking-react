import React, { useEffect, useState } from "react"
import moment from "moment"
import { Row, Col } from "react-bootstrap"
import { KYC, User } from "../../../core/models"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { FetchAdminKYCsAsync, UnBanAdminKYCAsync } from "../../../core/redux/dashboard/kyc"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { CRUDBuilderKyc } from "../../../widgets/crud-builder-kyc"
import { CustomText } from "../../../components/custom-text"
import { CustomModal } from "../../../components/custom-modal"
import { CustomSpace } from "../../../components/custom-space"

import "../index.scss"
import { CustomImageViewer } from "../../../components/custom-image-viewer/CustomImageViewer"

interface UserInfoProps {
  showModal: User | null
  setshowModal: (e: User | null) => void
}

export const UserInfoModal = ({ showModal, setshowModal }: UserInfoProps) => (
  <CustomModal show={Boolean(showModal)} onHide={() => setshowModal(null)} title="User Information">
    <Row className="justify-content-center" data-testid="row-user-information">
      <Col xs={11} className="d-flex my-2 gap-3">
        <CustomSpace direction="vertical" fill size={30} align="start">
          <CustomText color="gold">
            <CustomText color="gray">Full name: </CustomText> {showModal?.last_name + " " + showModal?.last_name}
          </CustomText>

          {showModal?.emails[0]?.old_email && (
            <CustomText color="gold">
              <CustomText color="gray">New Email: </CustomText> {showModal?.email}
            </CustomText>
          )}

          <CustomText color="gold">
            <CustomText color="gray">Old Email: </CustomText> {showModal?.emails[0]?.old_email ?? showModal?.email}
          </CustomText>
          <CustomText color="gold">
            <CustomText color="gray">Phone number: </CustomText> {showModal?.phone_number}
          </CustomText>
          <CustomText color="gold">
            <CustomText color="gray">GOLC: </CustomText>
            {String(Boolean(showModal?.golc))}
          </CustomText>
          <CustomText color="gold">
            <CustomText color="gray">Verified: </CustomText>
            {String(Boolean(showModal?.verified))}
          </CustomText>
        </CustomSpace>
      </Col>
    </Row>
  </CustomModal>
)

export const KYCs: React.FC = () => {
  const dispatch = useAppDispatch()
  const [showModal, setshowModal] = useState<User | null>(null)
  const { kycs, status } = useAppSelector((state) => state.AdminKycs)
  const { permessions } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchAdminKYCsAsync())
  }, [])

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

  return (
    <Row className="px-3 g-0">
      <UserInfoModal showModal={showModal} setshowModal={setshowModal} />
      <Col>
        <CustomCard data-testid="card-kycs-information" dashboard>
          <CRUDBuilderKyc
            data-testid="table-KYCs-information"
            inputs={kyc_inputs}
            status={status}
            title={"KYC"}
            data={kycs.data.filter((el) => el.status !== "PENDING")}
            reFetch={() => dispatch(FetchAdminKYCsAsync())}
            nextPage={() => kycs.data.length >= 10 && dispatch(FetchAdminKYCsAsync({ page: Number(kycs.page) + 1 }))}
            prevPage={() => Number(kycs.page) > 0 && dispatch(FetchAdminKYCsAsync({ page: Number(kycs.page) - 1 }))}
            gotoPage={(page: number) => dispatch(FetchAdminKYCsAsync({ page }))}
            onUnBan={permessions.isKyc ? (req: { id: number; note: string }) => dispatch(UnBanAdminKYCAsync(req)) : undefined}
            page={Number(kycs.page)}
            total_pages={Number(kycs.total_pages)}
            onSearch={(search: string) => dispatch(FetchAdminKYCsAsync({ page: 0, search }))}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}
