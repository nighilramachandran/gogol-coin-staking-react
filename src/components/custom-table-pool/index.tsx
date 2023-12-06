import React, { FC } from "react"
import { Table } from "react-bootstrap"
import "../index.scss"

interface CustomTablePool {
  header: string[]
  content: string[][]
}

export const CustomTablePool: FC<CustomTablePool> = ({ content, header }) => {
  return (
    <div data-testid="table-pool" className="tablepool">
      <Table striped bordered hover className="table-two table-borderless ">
        <thead style={{ color: "black" }}>
          <tr>
            {header.map((item) => (
              <th scope="col">{item}</th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody bg-withe">
          {content.map((arr) => (
            <tr style={{ color: "black" }}>
              {arr.map((item) => (
                <td className="td">{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
