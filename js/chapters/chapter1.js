// 第一章：初出茅庐
export const chapter1 = {
    title: '第一章 初出茅庐',
    prologue: '年幼丧父家中贫寒，16岁你刚完婚，便带着家中的最后一枚铜钱外出谋求生路；你背着行囊走过村口的石桥，回头望了一眼家乡，又低头看了一眼手里的铜钱，踏上了徽杭古道。',
    
    // 故事场景脚本
    storyScript: [
        {
            text: '年幼丧父家中贫寒，16岁你刚完婚，便带着家中的最后一枚铜钱外出谋求生路；',
            background: 'images/backgrounds/chapter1/cha1-1.png',
            character: null,
            position: 'center'
        },
        {
            text: '你背着行囊走过村口的石桥，回头望了一眼家乡，又低头看了一眼手里的铜钱，踏上了徽杭古道。',
            background: 'images/backgrounds/chapter1/cha1-1.png',
            character: null,
            position: 'center'
        }
    ],
    
    // 卡牌事件配置
    cardEvents: [
            {
              "id": "event1",
              "title": "路途选择",
              "description": "古道上，马队轰隆而过，为首的虬髯汉子突然勒马，故意让泥浆溅满母亲为你浆洗的短褐",
              "choices": [
                {
                  "text": "低头抹去脸上泥点",
                  "result": "你默默擦去泥点，继续前行"
                },
                {
                  "text": "扔石块反击",
                  "result": "你愤怒反击，但被马队围堵一番，才得脱身"
                }
              ]
            },
            {
              "id": "event2",
              "title": "初到杭州",
              "description": "到达杭州，在码头遇到一位老乞",
              "choices": [
                {
                  "text": "赠予他剩余的盘缠",
                  "result": "老乞感激涕零，口中念叨你是好人"
                },
                {
                  "text": "假装没听到快步走开",
                  "result": "你走得匆匆，只留老乞一声叹息"
                }
              ]
            },
            {
              "id": "event3",
              "title": "机会来临",
              "description": "遇到茶庄掌柜在招募学徒",
              "choices": [
                {
                  "text": "报名加入公平竞争",
                  "result": "你通过考核，成功成为学徒"
                },
                {
                  "text": "贿赂账房帮你说好话",
                  "result": "你成功入选，但账房记住了你的“投名状”"
                }
              ]
            },
            {
              "id": "event4",
              "title": "师命难违",
              "description": "师傅让你整理发霉的账本",
              "choices": [
                {
                  "text": "熬夜重抄账本",
                  "result": "你认真完成任务，获得师傅赞赏"
                },
                {
                  "text": "偷偷撕毁坏页",
                  "result": "你侥幸蒙混过关，但心中不安"
                }
              ]
            },
            {
              "id": "event5",
              "title": "发现黑账",
              "description": "发现师兄做假账，他威胁分你三成利润",
              "choices": [
                {
                  "text": "向师傅举报",
                  "result": "师兄被逐出茶庄，你却也遭到其他师兄排挤"
                },
                {
                  "text": "加入分赃",
                  "result": "你获得额外收入，也背上秘密"
                }
              ]
            },
            {
              "id": "event6",
              "title": "夜路艰难",
              "description": "深夜背茶过独木桥，老马夫索要一半货物当路费",
              "choices": [
                {
                  "text": "咬牙自己背",
                  "result": "你精疲力尽，但保住了全部茶货"
                },
                {
                  "text": "交出货物",
                  "result": "你少了不少货，但顺利过桥"
                }
              ]
            },
            {
              "id": "event7",
              "title": "家书抵万金",
              "description": "妻子来信说母亲被债主殴打",
              "choices": [
                {
                  "text": "典当棉衣寄钱",
                  "result": "你忍寒寄钱，母亲得以缓解困境"
                },
                {
                  "text": "谎称没钱",
                  "result": "你选择保自身温暖，却心中愧疚"
                }
              ]
            },
            {
              "id": "event8",
              "title": "诚信考验",
              "description": "集市上，茶商压价收购你的毛峰。当地货郎暗示可掺枯叶增重，你会？",
              "choices": [
                {
                  "text": "诚信交易",
                  "result": "你失去了部分利润，但获得回头客"
                },
                {
                  "text": "掺假增重",
                  "result": "你短期获利，但名声渐差"
                }
              ]
            },
            {
              "id": "event9",
              "title": "师傅的条件",
              "description": "师傅病重，欲传授你制茶秘方与人脉，但要你娶其女",
              "choices": [
                {
                  "text": "应允婚约",
                  "result": "你得传衣钵，但内心复杂"
                },
                {
                  "text": "以家中有妻拒绝",
                  "result": "你保住诚信，错失机会"
                }
              ]
            },
            {
              "id": "event10",
              "title": "前路抉择",
              "description": "同乡邀请你北上扬州投身盐业",
              "choices": [
                {
                  "text": "转行盐业",
                  "result": "你踏上全新旅途，前途未知",
                  nextChapter: true
                },
                {
                  "text": "留守茶业",
                  "result": "你继续深耕茶行，技艺渐精",
                 ending: 'ending-1'
                }
              ]
            }
    ]
}
