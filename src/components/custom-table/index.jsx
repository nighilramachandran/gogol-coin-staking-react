import React, { useMemo, useState } from "react"
import { DropdownButton, Dropdown, Modal, Spinner, Col, Form, Row } from "react-bootstrap"
import { useTable, usePagination, useFilters, useAsyncDebounce, useGlobalFilter } from "react-table"
import { CustomButton } from "../custom-button"
import { CustomForm } from "../custom-form/custom-form"
import { CustomSpace } from "../custom-space"

// A great library for fuzzy filtering/sorting items
import { matchSorter } from "match-sorter"

import "../index.scss"
import { CustomText } from "../custom-text"
import { Icon } from "../icon"
import { useMatch } from "react-router-dom"

// Define a default UI for filtering
function GlobalFilter({ onSearch }) {
  // const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState("")
  const onChange = useAsyncDebounce((value) => {
    onSearch(value)
  }, 400)

  return (
    <span>
      <input
        data-testid="input-Search"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`Search`}
        style={{
          fontSize: "1rem",
          // border: "0",
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter() {
  return <></>
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val

export const CustomTable = (props) => {
  const {
    columns,
    data,
    status,
    title,
    inputs,
    onUpdate,
    onDelete,
    onInsert,
    onActive,
    onChangeRole,
    onDeActive,
    onSendGols,
    onChangeToGolc,
    paginate = true,
    reFetch,
    search = true,
    onAccept,
    onRestore,
    onReject,
    onBan,
    onUnBan,
    nextPage,
    prevPage,
    gotoPage,
    total_pages: pageCount,
    page: pageIndex,
    onSearch,
    filter,
    filterAction,
    ...rest
  } = props

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'page', we'll use page,
    // which has only the page for the active page

    // The rest of these things are super handy, too ;)
    // canPreviousPage,
    // canNextPage,
    pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,
    // state: { pageIndex, pageSize },
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn, // Be sure to pass the defaultColumn option
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination
  )

  let canPreviousPage = pageIndex > 0
  let canNextPage = pageIndex < pageCount - 1
  const [updatedItem, setUpdatedItem] = useState({})

  const [isShow, setisShow] = useState(false)
  const [isShowDeleteModal, setisShowDeleteModal] = useState(null)
  const [isShowConfirm, setisShowConfirm] = useState(null)
  const [isShowRestoreConfirm, setisShowRestoreConfirm] = useState(null)
  const [isShowConfirmChangeToGolcModal, setisShowConfirmChangeToGolcModal] = useState(null)
  const [isShowConfirmChangeRoleModal, setisShowConfirmChangeRoleModal] = useState(null)

  const [roleValue, setRoleValue] = useState("USER")

  const roles = [
    { name: "Users", value: "USER" },
    { name: "Viewer", value: "VIEWER" },
    { name: "KYC", value: "KYC" },
    { name: "KYC Staking", value: "KYCSTAKING" },
  ]

  const ConfirmChangeRoleModal = useMemo(
    () => (
      <Modal show={!!isShowConfirmChangeRoleModal} onHide={() => setisShowConfirmChangeRoleModal(false)}>
        <Modal.Header className="justify-content-center">
          <CustomSpace direction="vertical" style={{ width: "100%" }}>
            <button className="modal-bck-btn" style={{ marginRight: "auto" }} onClick={() => setisShowConfirmChangeRoleModal(false)}>
              <Icon size="large" className="" style={{ fontSize: "20px" }} name="arrow-back-outline"></Icon>
            </button>
            <Modal.Title>
              <CustomText color="dark">Confirm Change Role</CustomText>
            </Modal.Title>
          </CustomSpace>
        </Modal.Header>
        <Modal.Body>
          <CustomSpace size={20} direction="vertical" style={{ width: "100%" }}>
            <div className="d-flex flex-column choose-roles" style={{ gap: "20px" }}>
              {roles.map((el) => (
                <Form.Check
                  value={el.value}
                  onClick={(e) => {
                    setRoleValue(e.target.value)
                  }}
                  label={
                    <CustomText fs={3} color="gray">
                      {el.name}
                    </CustomText>
                  }
                  name="group1"
                  type={"radio"}
                />
              ))}
            </div>
            <div className="d-flex justify-content-center gap-2" style={{ width: "100%" }}>
              <CustomButton
                onClick={() => {
                  onChangeRole({ id: isShowConfirmChangeRoleModal.id, role: roleValue })
                  setisShowConfirmChangeRoleModal(null)
                }}
              >
                Change
              </CustomButton>
            </div>
          </CustomSpace>
        </Modal.Body>
      </Modal>
    ),
    [isShowConfirmChangeRoleModal, onChangeRole, roleValue]
  )
  const ConfirmDeleteModal = useMemo(
    () => (
      <Modal show={!!isShowDeleteModal} onHide={() => setisShowDeleteModal(false)}>
        <Modal.Header>
          <CustomSpace direction="vertical" style={{ width: "100%" }}>
            <button className="modal-bck-btn" style={{ marginRight: "auto" }} onClick={() => setisShowDeleteModal(null)}>
              <Icon size="large" className="" style={{ fontSize: "20px" }} name="arrow-back-outline"></Icon>
            </button>
            <Modal.Title>
              <CustomSpace direction="vertical">
                <CustomText color="dark">Confirm Delete</CustomText>
                <CustomText color="gray" style={{ textAlign: "center", wordBreak: "break-word" }}>
                  {isShowDeleteModal?.username}
                </CustomText>
              </CustomSpace>
            </Modal.Title>
          </CustomSpace>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <CustomButton
              data-testid="delete-custom-table"
              bg="danger"
              onClick={() => {
                onDelete(isShowDeleteModal.id)
                setisShowDeleteModal(null)
              }}
            >
              Delete
            </CustomButton>
          </div>
        </Modal.Body>
      </Modal>
    ),
    [isShowDeleteModal, onDelete]
  )
  const ConfirmChangeToGolcModal = useMemo(
    () => (
      <Modal show={!!isShowConfirmChangeToGolcModal} onHide={() => setisShowConfirmChangeToGolcModal(null)}>
        <Modal.Header>
          <CustomSpace direction="vertical" style={{ width: "100%" }}>
            <button className="modal-bck-btn" style={{ marginRight: "auto" }} onClick={() => setisShowConfirmChangeToGolcModal(null)}>
              <Icon size="large" className="" style={{ fontSize: "20px" }} name="arrow-back-outline"></Icon>
            </button>
            <Modal.Title>
              <CustomSpace direction="vertical">
                <CustomText color="dark">Confirm {isShowConfirmChangeToGolcModal?.action}</CustomText>
              </CustomSpace>
            </Modal.Title>
          </CustomSpace>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <CustomButton
              onClick={() => {
                onChangeToGolc(isShowConfirmChangeToGolcModal?.id)
                setisShowConfirmChangeToGolcModal(null)
              }}
            >
              {isShowConfirmChangeToGolcModal?.action ?? "Change To Golc"}
            </CustomButton>
          </div>
        </Modal.Body>
      </Modal>
    ),
    [isShowConfirmChangeToGolcModal, onChangeToGolc]
  )

  const ConfirmRestoreModal = useMemo(
    () => (
      <Modal show={!!isShowRestoreConfirm} onHide={() => setisShowRestoreConfirm(null)}>
        <Modal.Header>
          <CustomSpace direction="vertical" style={{ width: "100%" }}>
            <button className="modal-bck-btn" style={{ marginRight: "auto" }} onClick={() => setisShowRestoreConfirm(null)}>
              <Icon size="large" className="" style={{ fontSize: "20px" }} name="arrow-back-outline"></Icon>
            </button>
            <Modal.Title>
              <CustomSpace direction="vertical">
                <CustomText color="dark">Confirm {isShowRestoreConfirm?.action}</CustomText>
                <CustomText color="gray" style={{ textAlign: "center", wordBreak: "break-word" }}>
                  {isShowRestoreConfirm?.username}
                </CustomText>
              </CustomSpace>
            </Modal.Title>
          </CustomSpace>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <CustomButton
              data-testid="activate"
              onClick={() => {
                onRestore(isShowRestoreConfirm?.id)
                setisShowRestoreConfirm(null)
              }}
            >
              {isShowRestoreConfirm?.action ?? "Activate"}
            </CustomButton>
          </div>
        </Modal.Body>
      </Modal>
    ),
    [isShowRestoreConfirm, onRestore]
  )

  const ConfirmModal = useMemo(
    () => (
      <Modal show={!!isShowConfirm} onHide={() => setisShowConfirm(null)}>
        <Modal.Header>
          <CustomSpace direction="vertical" style={{ width: "100%" }}>
            <button className="modal-bck-btn" style={{ marginRight: "auto" }} onClick={() => setisShowConfirm(null)}>
              <Icon size="large" className="" style={{ fontSize: "20px" }} name="arrow-back-outline"></Icon>
            </button>
            <Modal.Title>
              <CustomSpace direction="vertical">
                <CustomText color="dark">Confirm {isShowConfirm?.action}</CustomText>
                <CustomText color="gray" style={{ textAlign: "center", wordBreak: "break-word" }}>
                  {isShowConfirm?.username}
                </CustomText>
              </CustomSpace>
            </Modal.Title>
          </CustomSpace>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <CustomButton
              onClick={() => {
                ;["Activate", "Accept"].includes(isShowConfirm?.action) ? onActive(isShowConfirm?.id) : onDeActive(isShowConfirm?.id)
                setisShowConfirm(null)
              }}
            >
              {isShowConfirm?.action ?? "Activate"}
            </CustomButton>
          </div>
        </Modal.Body>
      </Modal>
    ),
    [isShowConfirm, onActive]
  )

  const CModal = useMemo(
    () => (
      <Modal show={isShow} onHide={() => setisShow(false)}>
        <Modal.Header className="justify-content-center">
          <CustomSpace direction="vertical" style={{ width: "100%" }}>
            <button className="modal-bck-btn" style={{ marginRight: "auto" }} onClick={() => setisShow(false)}>
              <Icon size="large" className="" style={{ fontSize: "20px" }} name="arrow-back-outline"></Icon>
            </button>
            <Modal.Title>
              <CustomText color="dark">Update {title}</CustomText>
            </Modal.Title>
          </CustomSpace>
        </Modal.Header>
        <Modal.Body>
          {inputs && (
            <CustomForm
              data-testid="table-custom-table"
              inputs={inputs.filter((e) => !e.ignore)}
              status={status}
              initialInputValues={updatedItem}
              // onCancel={() => setisShow(false)}
              actionsJustify={"center"}
              onSubmit={(vals) => {
                onUpdate({ id: updatedItem.id, ...vals })
                setisShow(false)
              }}
            />
          )}
        </Modal.Body>
        §
      </Modal>
    ),
    [isShow]
  )

  const GetColors = (value) => {
    switch (value) {
      case "ENABLED":
        return "#33C500"
      case "ACTIVE":
        return "#33C500"
      case "APPROVED":
        return "#33C500"
      case "DISABLED":
        return "#FF0000"
      case "CLOSED":
        return "#FF0000"
      case "CANCELED":
        return "#FF0000"
      default:
        return "white"
    }
  }

  const matchmangeClaims = useMatch("/dashboard/manage-claims")
  const matchDashboard = useMatch("/dashboard")
  const matchGolcDashboard = useMatch("/dashboard/golc-dashboard")

  return (
    <>
      {CModal}
      {ConfirmDeleteModal}
      {ConfirmRestoreModal}
      {ConfirmModal}

      {ConfirmChangeToGolcModal}
      {ConfirmChangeRoleModal}

      <Row>
        <Col lg={12} xl={4}>
          {!matchDashboard && !matchGolcDashboard && (
            <div data-testid="btn-paginate" className="pagination">
              <button data-testid="btn-paginate" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>
              <button onClick={() => prevPage()} disabled={!canPreviousPage}>
                {"<"}
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                {">"}
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {">>"}
              </button>{" "}
              <span>
                <CustomText data-testid="pages-custom-table" fs="5">
                  Page {pageIndex + 1} of {pageCount}
                </CustomText>
              </span>
            </div>
          )}
        </Col>
        <Col lg={12} xl={8}>
          <div style={{ marginLeft: "auto", lg: { maxWidth: "600px" } }}>
            <Row className="justify-content-end">
              {search && (
                <Col md={5} xl={5} className="mb-3">
                  <div className="search-box">
                    <GlobalFilter onSearch={onSearch} />

                    <img data-testid="img-icon-custom-table" src="/assets/icons/search.svg" alt="" />
                  </div>
                </Col>
              )}

              {filter && (
                <Col md={5} xl={8} className="mb-3">
                  <div className="table-filter">
                    <select onChange={(e) => filterAction(e.target.value)} data-testid="filter-icon-custom-table">
                      {filter?.map((el) => (
                        <option value={el.value}>{el.name}</option>
                      ))}
                    </select>
                    <Icon
                      data-testid="icon-custom-table"
                      style={{ position: "absolute", right: "8%", top: "10px", color: "#828282" }}
                      name="funnel-outline"
                    ></Icon>
                  </div>
                </Col>
              )}
              <Icon
                data-testid="re-fetch-custom-table"
                onClick={reFetch}
                disabled={status === "loading"}
                style={{ width: "32px", height: "32px", cursor: "pointer", color: "white" }}
                name="refresh-outline"
              />
            </Row>
          </div>
        </Col>
      </Row>

      <table {...getTableProps()} className={`table overflow-scroll ${rest.className}`} {...rest}>
        <thead>
          {headerGroups.map((headerGroup, ind) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th style={{ textAlign: ind !== 0 ? "center" : "start", verticalAlign: "middle" }} {...column.getHeaderProps()}>
                  {column.render("Header")}

                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
              {ind !== 0 && !matchmangeClaims && !matchDashboard && !matchGolcDashboard && (
                <th style={{ textAlign: "center", verticalAlign: "middle" }}>Actions</th>
              )}

              {onInsert && ind === 0 && (
                <th className="d-flex justify-content-end">
                  <CustomButton data-testid="add-custom-table" onClick={() => setisShow(true)}>
                    Add
                  </CustomButton>
                </th>
              )}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        width: cell.column.width,
                        color: GetColors(cell.value),
                        // cell.value === "ENABLED" || cell.value === "ACTIVE" || cell.value === "DISABLED" || cell.value === "CLOSED"
                        //   ? cell.value === "ENABLED" || cell.value === "ACTIVE"
                        //     ? "#33C500" //green
                        //     : "#FF0000" //red
                        //   : "",
                      }}
                      {...cell.getCellProps()}
                    >
                      {cell.value === null || cell.value === "null" ? "-" : cell.render("Cell")}
                    </td>
                  )
                })}
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <CustomSpace fill>
                    {(onChangeRole || onChangeToGolc || onUpdate || onDelete || onActive || onRestore || onDeActive || onSendGols) && (
                      <DropdownButton
                        id="dropdown-actions-button"
                        title={
                          <Icon size="large" className="users-actions-btn" style={{ fontSize: "20px" }} name="ellipsis-vertical"></Icon>
                        }
                      >
                        {onChangeRole && (
                          <Dropdown.Item
                            align={{ md: "center" }}
                            onClick={() => setisShowConfirmChangeRoleModal({ action: "ChangeRole", id: Number(row.values.id) })}
                          >
                            {"Edit Role"}
                          </Dropdown.Item>
                        )}
                        {onChangeToGolc && !(row.values?.golc === "Yes" || row.values?.verified === "No") && (
                          <Dropdown.Item
                            data-testid="change-to-golc"
                            onClick={() => setisShowConfirmChangeToGolcModal({ action: "Change To Golc", id: Number(row.values.id) })}
                          >
                            To Golc
                          </Dropdown.Item>
                        )}
                        {onUpdate && (
                          <Dropdown.Item
                            data-testid="update-values"
                            onClick={() => {
                              setisShow(true)
                              setUpdatedItem(row.values)
                            }}
                          >
                            Update
                          </Dropdown.Item>
                        )}
                        {onDelete && !(row.values?.status === "APPROVED") && (
                          <Dropdown.Item
                            data-testid="delete-user"
                            onClick={() =>
                              setisShowDeleteModal({
                                id: Number(row.values.id),
                                username: row.values.username ?? row.values.first_name,
                              })
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        )}
                        {onActive && !(row.values?.status === "ENABLED") && (
                          <Dropdown.Item
                            data-testid="status-user"
                            onClick={() => setisShowConfirm({ action: title === "KYC" ? "Accept" : "Activate", id: Number(row.values.id) })}
                          >
                            {title === "KYC" ? "Accept" : "Activate"}
                          </Dropdown.Item>
                        )}
                        {onRestore && (
                          <Dropdown.Item
                            data-testid="restore-user"
                            onClick={() =>
                              setisShowRestoreConfirm({ action: "Restore", id: Number(row.values.id), username: row.values.username })
                            }
                          >
                            {"Restore"}
                          </Dropdown.Item>
                        )}
                        {onDeActive && !(row.values?.status === "DISABLED") && (
                          <Dropdown.Item
                            data-testid="disabled-user"
                            onClick={() =>
                              setisShowConfirm({
                                action: title === "KYC" ? "Reject" : "Deactivate",
                                id: Number(row.values.id),
                                username: String(row.values.username),
                              })
                            }
                          >
                            {title === "KYC" ? "Reject" : "Deactivate"}
                          </Dropdown.Item>
                        )}
                        {onSendGols && <Dropdown.Item onClick={() => onSendGols(row.values)}>Send Gols</Dropdown.Item>}
                      </DropdownButton>
                    )}
                  </CustomSpace>
                </td>
              </tr>
            )
          })}
        </tbody>
        <div className="table-backdrop" style={{ display: status === "loading" ? "flex" : "none" }}>
          <Spinner animation="border" />
        </div>
      </table>
    </>
  )
}
