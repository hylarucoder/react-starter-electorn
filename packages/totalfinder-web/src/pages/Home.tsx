import React, { useEffect } from "react"
import { Button, Upload, message, Tabs, Steps, Spin, Result } from "antd"
import { LoadingOutlined, PlusSquareFilled } from "@ant-design/icons"
import { taskQuery, taskStart, taskUploaded } from "../api/http"
import { useLocalObservable } from "mobx-react"
import { useInterval } from "../hooks/useInterval"

const { Dragger } = Upload
const { TabPane } = Tabs
const { Step } = Steps

const Step01WaitForUpload = ({ onNext }: { onNext: Function }) => {
  return (
    <div>
      <Dragger
        name="file"
        multiple={false}
        customRequest={async ({ file }: { file: any }) => {
          /*
            1. 先拿token，上传cos
            2. 提交服务器
           */
          const resp = await taskStart({
            file_info: {
              lastModified: file.lastModified,
              lastModifiedDate: file.lastModifiedDate,
              name: file.name,
              path: file.path,
              size: file.size,
              type: file.type,
              uid: file.uid,
            },
          })
          // const res = await fetch("http://localhost:5000/user/transform_task/start", {
          //   method: "POST",
          //   body: formData,
          // })
          // const formData = new FormData()
          // formData.append("file", file)
          onNext(resp.item)

          // saveFile(`${file.path}.docx`, await res.arrayBuffer())
          // message.success(`转码完成，地址为${file.path}.docx`, 3000)
          // console.log(res)
        }}
      >
        <p className="ant-upload-drag-icon">
          <PlusSquareFilled />
        </p>
        <p className="ant-upload-text">点击选择文件</p>
      </Dragger>
    </div>
  )
}

const Step02Uploaded = ({ onNext }: { onNext: Function }) => {
  // 每隔两秒 polling 一次
  useEffect(() => {
    onNext()
  })
  return <div>上传成功</div>
}

const Step03Transforming = ({ onQueryTask }: { onQueryTask: Function }) => {
  useInterval(() => {
    onQueryTask()
  }, 2000)
  return (
    <div>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
      <div>正在转换中</div>
    </div>
  )
}

const Step04Finished = ({ onNext }: { onNext: Function }) => {
  return (
    <div>
      <Result
        status="success"
        title="转换成功"
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button key="add">继续添加文件</Button>,
          <Button key="file">打开文件</Button>,
          <Button key="folder">打开文件夹</Button>,
        ]}
      />
    </div>
  )
}

enum StepEnum {
  STEP_01_WAIT_FOR_UPLOAD,
  STEP_02_UPLOADED,
  STEP_03_TRANSFORMING,
  STEP_04_FINISHED,
}

const steps = [
  {
    title: "上传文件",
    index: StepEnum.STEP_01_WAIT_FOR_UPLOAD,
  },
  {
    title: "上传完成",
    index: StepEnum.STEP_02_UPLOADED,
  },
  {
    title: "正在转换",
    index: StepEnum.STEP_03_TRANSFORMING,
  },
  {
    title: "转换完成",
    index: StepEnum.STEP_04_FINISHED,
  },
]

function UploaderPDF2Word() {
  const [current, setCurrent] = React.useState(0)
  const mTask = useLocalObservable(() => ({
    id: undefined,
    status: undefined,
    start: async (item) => {
      mTask.id = item.id
    },
    uploaded: async (url) => {
      await taskUploaded({
        id: mTask.id,
        url: url,
      })
    },
  }))

  return (
    <>
      <div className="steps-content">
        {steps[current].index == StepEnum.STEP_01_WAIT_FOR_UPLOAD && (
          <Step01WaitForUpload
            onNext={async (item) => {
              await mTask.start(item)
              setCurrent(current + 1)
            }}
          />
        )}
        {steps[current].index == StepEnum.STEP_02_UPLOADED && (
          <Step02Uploaded
            onNext={async () => {
              await mTask.uploaded(
                "http://www.thermo.com.cn/UploadFiles/file/BID%20product%20instruction-CN/k0821-GeneJETViral%20DNA%20and%20RNA%20Purification%20Kit-Sherry-Final.pdf"
              )
              setCurrent(current + 1)
            }}
          />
        )}
        {steps[current].index == StepEnum.STEP_03_TRANSFORMING && (
          <Step03Transforming
            onQueryTask={async () => {
              const resp = await taskQuery({
                id: mTask.id,
              })

              console.log("id", mTask.id, resp.item)
              if (resp.item.status == "TRANSFORMED_SUCCESS") {
                setCurrent(current + 1)
              }
            }}
          />
        )}
        {steps[current].index == StepEnum.STEP_04_FINISHED && (
          <Step04Finished
            onNext={() => {
              setCurrent(current + 1)
            }}
          />
        )}
      </div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
    </>
  )
}

export function FromPDF() {
  return (
    <Tabs tabPosition="left">
      <TabPane tab="test1" key="1">
        test1
      </TabPane>
      <TabPane tab="test1" key="2">
        test1
      </TabPane>
      <TabPane tab="test1" key="3">
        test1
      </TabPane>
      <TabPane tab="test1" key="4">
        test1
      </TabPane>
      <TabPane tab="test1" key="5">
        test1
      </TabPane>
    </Tabs>
  )
}
