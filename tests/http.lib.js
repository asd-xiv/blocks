/* eslint-disable new-cap */

import FormData from "form-data"
import fetch from "node-fetch"
import { pipe, reduce } from "@mutantlove/m"

const REQ = (url, { method, query, headers, body }) => {
  return fetch(url, {
    method,
    query,
    headers: { "content-type": "application/json", ...headers },
    body,
  })
    .then(res =>
      res.json().then(data => {
        res.data = data

        return res
      })
    )
    .then(res => {
      if (!res.ok) {
        const error = new Error(res.statusText)

        error.status = res.status
        error.body = res.data

        throw error
      }

      return res.data
    })
}

export const POST = (url, { query, headers, body } = {}) =>
  REQ(url, {
    method: "POST",
    query,
    headers,
    body,
  })

export const GET = (url, { query, headers } = {}) =>
  REQ(url, {
    method: "GET",
    query,
    headers,
  })

export const FORM_DATA = (url, { body = {}, headers } = {}) => {
  const form = new FormData()

  return REQ(url, {
    method: "POST",
    body: pipe(
      Object.entries,
      reduce((acc, [key, value]) => {
        acc.append(key, value)

        return acc
      }, form)
    )(body),
    headers: {
      ...form.getHeaders(),
      ...headers,
    },
  })
}
