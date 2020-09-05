import React from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from 'styled-components/cssprop'
import styled from 'styled-components'

const Horizontal = styled.div`
   display: flex;
   flex-direction: row;
`
const Vertical = styled.div`
   display: flex;
   flex-direction: column;
`

export const JsonViewerPage = () => {
   const [text, setText] = React.useState('{"placeholder": "Replace this with any json you like."}')
   const obj = React.useMemo<JsonNode>(() => {
      try {
         return JSON.parse(text)
      } catch (err) {
         return null
      }
   }, [text])
   return (
      <Vertical
         css={`
            padding: 16px;
         `}>
         <div
            css={`
               font-size: 16px;
               margin-bottom: 16px;
            `}>
            Json Viewer
         </div>
         <Horizontal>
            <div
               css={`
                  margin-right: 16px;
               `}>
               <InputBox onChange={setText} value={text} />
            </div>
            <div
               css={`
                  min-width: 300px;
               `}>
               {obj ? <FormattedJson value={obj} /> : <div>Invalid json.</div>}
            </div>
         </Horizontal>
      </Vertical>
   )
}

const InputBox = ({ onChange, value }: { value: string; onChange: (s: string) => void }) => {
   return (
      <textarea
         value={value}
         onChange={e => onChange(e.target.value)}
         css={`
            border-radius: 4px;
            padding: 16px;
            background-color: #eee;
            border: 0;
            outline: none;
            width: 400px;
            height: 400px;
            resize: none;
         `}
      />
   )
}

export type PlainObject = { [key: string]: JsonNode }
export type SingleValueJsonNode = string | boolean | number | null | undefined
export type JsonNode = SingleValueJsonNode | PlainObject | JsonNode[]

function isPlainObject(value: JsonNode): value is PlainObject {
   return value != null && !Array.isArray(value) && typeof value === 'object'
}

export const FormattedJson = ({ value }: { value: JsonNode }) => {
   if (!value) return null
   return (
      <div
         css={`
            font-family: monospace;
            background-color: #eee;
            border-radius: 4px;
            padding: 16px;
         `}>
         <PropValueNode value={value} />
      </div>
   )
}

const StringNode = styled.span`
   color: green;
`

const NumberNode = styled.span`
   color: blue;
`

const NullNode = styled.span`
   color: orange;
`

const BooleanNode = styled.span`
   color: salmon;
`

const CountComment = styled.span`
   color: gray;
`

const SingleValue = ({ value }: { value: SingleValueJsonNode }) => {
   if (typeof value === 'string') {
      return <StringNode>"{value}"</StringNode>
   }
   if (typeof value === 'number') {
      return <NumberNode>{value}</NumberNode>
   }
   if (value == null) {
      return <NullNode>null</NullNode>
   }
   return <BooleanNode>{value ? 'true' : 'false'}</BooleanNode>
}

export const PropValueNode = ({
   prop = null,
   value,
   isLast = true,
}: {
   prop?: string | null
   value: JsonNode
   isLast?: boolean
}) => {
   const [isCollapsed, setCollapsed] = React.useState(false)
   const isObject = isPlainObject(value)
   const isArray = Array.isArray(value)
   const itemCount = isArray
      ? (value as JsonNode[]).length
      : isObject
      ? Object.keys(value as PlainObject).length
      : null
   const isContainer = isObject || isArray
   const startSymbol = isObject ? '{' : isArray ? '[' : null
   const endSymbol = isObject ? '}' : isArray ? ']' : null
   const commaAfter = !isLast
   return (
      <div
         css={`
            position: relative;
         `}>
         {isContainer && (
            <div
               onClick={() => setCollapsed(c => !c)}
               style={{ color: isCollapsed ? 'red' : 'blue' }}
               css={`
                  cursor: pointer;
                  position: absolute;
                  left: -12px;
                  top: 0;
               `}>
               {isCollapsed ? '+' : '-'}
            </div>
         )}
         {
            <div>
               {prop && `"${prop}":`}
               {isContainer ? (
                  ' ' + startSymbol
               ) : (
                  <>
                     {' '}
                     <SingleValue value={value as SingleValueJsonNode} />
                     {commaAfter ? ',' : ''}
                  </>
               )}
               {isCollapsed && (
                  <>
                     {` ... ${endSymbol}${commaAfter ? ',' : ''} `}
                     <CountComment>
                        // {itemCount} item{itemCount !== 1 ? 's' : ''}
                     </CountComment>
                  </>
               )}
            </div>
         }
         {!isContainer ? null : (
            <div style={{ display: isCollapsed ? 'none' : undefined }}>
               <div
                  css={`
                     padding-left: 16px;
                  `}>
                  {Object.entries(value as PlainObject).map(([key, val], i, arr) => {
                     return (
                        <div
                           key={key}
                           css={`
                              display: flex;
                           `}>
                           <PropValueNode
                              prop={isObject ? key : null}
                              value={val}
                              isLast={i === arr.length - 1}
                           />
                        </div>
                     )
                  })}
               </div>
               <div>
                  {endSymbol}
                  {commaAfter ? ',' : ''}
               </div>
            </div>
         )}
      </div>
   )
}
