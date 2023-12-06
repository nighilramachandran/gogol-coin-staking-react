import React, { FC } from "react"
import { Table } from "react-bootstrap"
import "../index.scss"

interface CustomTableInfo {
  header: string[]
  content: string[][]
}

export const CustomTableInfo: FC<CustomTableInfo> = ({ content, header }) => {
  return (
    <div data-testid="table-info" className="tableinfo">
      <Table striped bordered hover className="table">
        <thead>
          <tr>
            {header.map((item) => (
              <th>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((arr) => (
            <tr>
              {arr.map((item) => (
                <td>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
