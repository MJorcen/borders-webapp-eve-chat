#!/bin/bash
for command in "build:vidjoy" "build:yaya" "build:chatJoi" "build:justVidTest" "build:vidHub" "build:vidChat"  "build:vidBuzz" "build:vidLink" "build:SoulChat" "build:SpicyChat" "build:strangers" "build:SexyChat" "build:vidChat" "build:Hornyhub" "build:Sexylivechat" 
do
  echo "正在执行: $command"
  yarn "$command"
  if [ $? -eq 0 ]; then
    echo "$command 执行成功！"
  else
    echo "$command 执行失败！"
  fi
done