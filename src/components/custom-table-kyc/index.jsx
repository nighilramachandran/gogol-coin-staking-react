import React, { useMemo, useState } from "react"
import { Col, Dropdown, DropdownButton, Modal, Row, Spinner } from "react-bootstrap"
import { useTable, usePagination, useFilters, useAsyncDebounce, useGlobalFilter } from "react-table"
import { CustomButton } from "../custom-button"
import { CustomForm } from "../custom-form/custom-form"
import { CustomSpace } from "../custom-space"
import { primarycolor } from "../../utils/constants/valiables"

// A great library for fuzzy filtering/sorting items
import { matchSorter } from "match-sorter"

import "../index.scss"
import { Icon } from "../icon"
import { CustomText } from "../custom-text"
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
        data-testid="input-table-kyc"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`Search...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
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

export const CustomTableKyc = (props) => {
  const {
    columns,
    data,
    status,
    title,
    inputs,
    onAccept,
    onReject,
    onBan,
    onUnBan,
    paginate = true,
    nextPage,
    prevPage,
    gotoPage,
    total_pages: pageCount,
    page: pageIndex,
    reFetch,
    search = true,
    onSearch,
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
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // initialState: { pageIndex: 0 },
      defaultColumn, // Be sure to pass the defaultColumn option
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination
  )

  let canPreviousPage = pageIndex > 0
  let canNextPage = pageIndex < pageCount - 1

  const [isShowConfirm, setisShowConfirm] = useState(null)

  const withNotesActions = ["Reject", "Ban", "Unban"]

  const submitAction = (vals) => {
    switch (isShowConfirm.action) {
      case "Ban":
        onBan({ id: isShowConfirm.id, ...vals })
        break
      case "Reject":
        onReject({ id: isShowConfirm.id, ...vals })
        break
      case "Unban":
        onUnBan({ id: isShowConfirm.id, ...vals })
        break
      default:
        break
    }
    setisShowConfirm(null)
  }

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
                <CustomText color="gray" style={{ textAlign: "center" }}>
                  {isShowConfirm?.full_name}
                </CustomText>
              </CustomSpace>
            </Modal.Title>
          </CustomSpace>
          {/* <Modal.Title data-testid="title-modal-kyc">Confirm {isShowConfirm?.action}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {withNotesActions.includes(isShowConfirm?.action) && inputs && (
            <CustomForm
              data-testid="input-form-modal-kyc"
              inputs={inputs.filter((e) => !e.ignore)}
              status={status}
              initialInputValues={isShowConfirm}
              actionsJustify="center"
              // onCancel={() => setisShowConfirm(null)}
              onSubmit={(vals) => {
                submitAction(vals)
              }}
            />
          )}

          {!withNotesActions.includes(isShowConfirm?.action) && (
            <div className="d-flex justify-content-center">
              <CustomButton
                onClick={() => {
                  onAccept(isShowConfirm?.id)
                  setisShowConfirm(null)
                }}
              >
                {isShowConfirm?.action ?? "Accept"}
              </CustomButton>
            </div>
          )}
        </Modal.Body>
      </Modal>
    ),
    [isShowConfirm, onAccept]
  )
  const matchmangeKycs = useMatch("/dashboard/manage-kycs")

  // Render the UI for your table
  return (
    <>
      {ConfirmModal}
      <Row>
        <Col lg={12} xl={4}>
          {paginate && (
            <div data-testid="btn-paginate-kyc" className="pagination">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>
              <button onClick={() => prevPage()} disabled={!canPreviousPage}>
                {"<"}
              </button>
              <button onClick={nextPage} disabled={!canNextPage}>
                {">"}
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {">>"}
              </button>
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageCount}
                </strong>
              </span>
            </div>
          )}
        </Col>
        <Col lg={12} xl={8}>
          <div style={{ marginLeft: "auto", lg: { maxWidth: "600px" } }}>
            <Row className="justify-content-end">
              <Col md={5} xl={6} className="mb-3">
                {search && (
                  <div className="search-box">
                    <GlobalFilter onSearch={onSearch} />

                    <img data-testid="img-icon-custom-table" src="/assets/icons/search.svg" alt="" />
                  </div>
                )}
              </Col>
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
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
              {ind !== 0 && !matchmangeKycs && <th style={{ textAlign: "center", verticalAlign: "middle" }}>Actions</th>}
            </tr>
          ))}
          {/* <tr>
            {search && (
              <th colSpan={17} className="search-box">
                <GlobalFilter onSearch={onSearch} />
              </th>
            )}
          </tr> */}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            // console.log(row)
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td style={{ textAlign: "center", verticalAlign: "middle", width: cell.column.width }} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  )
                })}
                <>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    {(onAccept || onReject || (onUnBan && row?.values?.status === "BANNED") || onBan) && (
                      <DropdownButton
                        id="dropdown-actions-button"
                        data-testid="dropdown-actions"
                        title={
                          <Icon size="large" className="users-actions-btn" style={{ fontSize: "20px" }} name="ellipsis-vertical"></Icon>
                        }
                      >
                        {onAccept && (
                          <Dropdown.Item
                            data-testid="dropdown-item-accept"
                            onClick={() => setisShowConfirm({ action: "Accept", ...row.values })}
                          >
                            Accept
                          </Dropdown.Item>
                        )}

                        {onReject && (
                          <Dropdown.Item
                            data-testid="dropdown-item-reject"
                            onClick={() => setisShowConfirm({ action: "Reject", ...row.values })}
                          >
                            Reject
                          </Dropdown.Item>
                        )}
                        {onUnBan && row?.values?.status === "BANNED" && (
                          <Dropdown.Item
                            data-testid="dropdown-item-unban"
                            onClick={() => setisShowConfirm({ action: "Unban", ...row.values })}
                          >
                            Unban
                          </Dropdown.Item>
                        )}
                        {onBan && (
                          <Dropdown.Item data-testid="DropdownItem-Ban" onClick={() => setisShowConfirm({ action: "Ban", ...row.values })}>
                            Ban
                          </Dropdown.Item>
                          // )}
                        )}
                      </DropdownButton>
                    )}
                  </td>
                </>
              </tr>
            )
          })}
        </tbody>
        <div className="table-backdrop" style={{ display: status === "loading" ? "flex" : "none" }}>
          <Spinner animation="border" />
        </div>
      </table>
      {/* <div className="table-footer">
        <CustomButton
          data-testid="re-fetch-table-footer"
          style={{
            width: 42,
            height: 40,
            display: "flex",
            alignItems: "center",
            color: primarycolor,
            minWidth: "intial",
            border: `1px solid ${primarycolor}`,
          }}
          onClick={reFetch}
          disabled={status === "loading"}
          bg="outline"
        >
          <Icon name="refresh-outline" />
        </CustomButton>
        {paginate && (
          <div data-testid="btn-paginate-kyc" className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => prevPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>
            <button onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageCount}
              </strong>
            </span>
          </div>
        )}
      </div> */}
    </>
  )
}
