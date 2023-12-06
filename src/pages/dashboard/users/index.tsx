import React, { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { CustomCard } from "../../../components/custom-card"
import { CustomInputFormProps } from "../../../components/custom-form/custom-form"
import { CustomGroupButtons } from "../../../components/custom-group-buttons"
import {
  ActiveAdminUserAsync,
  DeActiveAdminUserAsync,
  FetchAdminUsersAsync,
  UpdateAdminUserAsync,
  ChangeUserToGolcAsync,
  SoftDeleteAdminUserAsync,
  FetchAdminDeletedUsersAsync,
  RestoreAdminUserAsync,
  ChangeRoleAdminUserAsync,
} from "../../../core/redux/dashboard/users"
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks"
import { Paginate } from "../../../utils/api/types"
import { CRUDBuilder } from "../../../widgets/crud-builder"

import "../index.scss"

const inputs: CustomInputFormProps[] = [
  {
    type: "text",
    name: "id",
    label: "ID",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "first_name",
    label: "First name",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "last_name",
    label: "Last name",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "email",
    label: "Email",
    colProps: { xs: 12 },
    validate: {
      required: true,
      rule: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
  },
  {
    type: "text",
    name: "phone_number",
    label: "Phone number",
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "username",
    label: "Username",
    validate: { required: true },
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "role",
    label: "Role",
    validate: { required: true },
    colProps: { xs: 12 },
    ignore: true,
  },

  {
    type: "text",
    name: "golc",
    label: "Golc",
    accessor: (row: any) => (row.golc === 0 ? "No" : "Yes"),
    colProps: { xs: 12 },
    ignore: true,
  },
  {
    type: "text",
    name: "verified",
    label: "Verified",
    accessor: (row: any) => (row.verified === 0 ? "No" : "Yes"),
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
]

const radios = [
  {
    value: 1,
    name: "All",
  },
  {
    value: 2,
    name: "Gogol",
  },
  {
    value: 3,
    name: "Golc",
  },
]

export const Users: React.FC = () => {
  const dispatch = useAppDispatch()
  const { users, status } = useAppSelector((state) => state.AdminUsers)

  const { permessions } = useAppSelector((state) => state.Auth)

  const [userType, setUserType] = useState<number>(1)

  useEffect(() => {
    dispatch(FetchAdminUsersAsync())
  }, [])

  const handleChange = (value: string) => {
    setUserType(parseInt(value))
    switch (parseInt(value)) {
      case 1:
        dispatch(FetchAdminUsersAsync({ page: 0 }))
        break
      case 2:
        dispatch(FetchAdminUsersAsync({ page: 0 }, 0))
        break
      case 3:
        dispatch(FetchAdminUsersAsync({ page: 0 }, 1))
        break
      default:
        break
    }
  }
  const fetchUsers = (paginator?: Paginate) => {
    switch (userType) {
      case 1:
        dispatch(FetchAdminUsersAsync(paginator))
        break
      case 2:
        dispatch(FetchAdminUsersAsync(paginator, 0))
        break
      case 3:
        dispatch(FetchAdminUsersAsync(paginator, 1))
        break
      default:
        break
    }
  }

  return (
    <Row className="px-3 g-0">
      <Col>
        <CustomCard dashboard>
          <Row>
            <Col className="d-flex justify-content-center mb-4">
              <CustomGroupButtons onChange={handleChange} radios={radios} />
            </Col>
          </Row>
          <CRUDBuilder
            inputs={inputs}
            title={"User"}
            data={users.data}
            status={status}
            onActive={permessions.isAdmin ? (id: number) => dispatch(ActiveAdminUserAsync({ id })) : undefined}
            onChangeToGolc={permessions.isAdmin ? (id: number) => dispatch(ChangeUserToGolcAsync({ id })) : undefined}
            onDeActive={permessions.isAdmin ? (id: number) => dispatch(DeActiveAdminUserAsync({ id })) : undefined}
            onUpdate={permessions.isAdmin ? (req: { id: number; email: string }) => dispatch(UpdateAdminUserAsync(req)) : undefined}
            onDelete={permessions.isAdmin ? (id: number) => dispatch(SoftDeleteAdminUserAsync({ id })) : undefined}
            onChangeRole={permessions.isAdmin ? (values) => dispatch(ChangeRoleAdminUserAsync(values)) : undefined}
            nextPage={() => users.data.length >= 10 && fetchUsers({ page: Number(users.page) + 1 })}
            prevPage={() => Number(users.page) > 0 && fetchUsers({ page: Number(users.page) - 1 })}
            gotoPage={(page: number) => fetchUsers({ page })}
            reFetch={() => fetchUsers()}
            page={Number(users.page)}
            total_pages={Number(users.total_pages)}
            onSearch={(search: string) => fetchUsers({ page: 0, search })}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}

export const DeletedUsers: React.FC = () => {
  const dispatch = useAppDispatch()
  const { deletedUsers, status } = useAppSelector((state) => state.AdminUsers)
  const [userType, setUserType] = useState<number>(1)
  const { permessions } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    dispatch(FetchAdminDeletedUsersAsync())
  }, [])

  const handleChange = (value: string) => {
    setUserType(parseInt(value))
    switch (parseInt(value)) {
      case 1:
        dispatch(FetchAdminDeletedUsersAsync({ page: 0 }))
        break
      case 2:
        dispatch(FetchAdminDeletedUsersAsync({ page: 0 }, 0))
        break
      case 3:
        dispatch(FetchAdminDeletedUsersAsync({ page: 0 }, 1))
        break
      default:
        break
    }
  }
  const fetchUsers = (paginator?: Paginate) => {
    switch (userType) {
      case 1:
        dispatch(FetchAdminDeletedUsersAsync(paginator))
        break
      case 2:
        dispatch(FetchAdminDeletedUsersAsync(paginator, 0))
        break
      case 3:
        dispatch(FetchAdminDeletedUsersAsync(paginator, 1))
        break
      default:
        break
    }
  }

  return (
    <Row className="px-3 g-0">
      <Col>
        <CustomCard dashboard>
          <Row>
            <Col className="d-flex justify-content-center mb-4">
              <CustomGroupButtons onChange={handleChange} radios={radios} />
            </Col>
            {/* <Col>
              <ToggleButtonGroup type="radio" name="options" defaultValue={userType} onChange={handleChange}>
                <ToggleButton id="tbg-radio-1" value={1}>
                  All
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2}>
                  Gogol
                </ToggleButton>
                <ToggleButton id="tbg-radio-3" value={3}>
                  Golc
                </ToggleButton>
              </ToggleButtonGroup>{" "}
            </Col> */}
          </Row>
          <CRUDBuilder
            inputs={inputs}
            title={"Deleted User"}
            data={deletedUsers.data}
            status={status}
            onRestore={permessions.isAdmin ? (id: number) => dispatch(RestoreAdminUserAsync({ id })) : undefined}
            // onChangeToGolc={(id: number) => dispatch(ChangeUserToGolcAsync({ id }))}
            // onDeActive={(id: number) => dispatch(DeActiveAdminUserAsync({ id }))}
            // onUpdate={(req: { id: number; email: string }) => dispatch(UpdateAdminUserAsync(req))}
            // onDelete={(id: number) => dispatch(SoftDeleteAdminUserAsync({ id }))}
            nextPage={() => deletedUsers.data.length >= 10 && fetchUsers({ page: Number(deletedUsers.page) + 1 })}
            prevPage={() => Number(deletedUsers.page) > 0 && fetchUsers({ page: Number(deletedUsers.page) - 1 })}
            gotoPage={(page: number) => fetchUsers({ page })}
            reFetch={() => fetchUsers()}
            page={Number(deletedUsers.page)}
            total_pages={Number(deletedUsers.total_pages)}
            onSearch={(search: string) => fetchUsers({ page: 0, search })}
          />
        </CustomCard>
      </Col>
    </Row>
  )
}
