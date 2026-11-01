"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { churchQuestions, questionCategories, questionResearch, type QuestionCategory } from "@/lib/way-questions-guide";
import styles from "./WayQuestionsGuide.module.css";

export function WayQuestionsWelcome() {
  return (
    <aside className={styles.welcome} aria-label="이 페이지에서 함께 할 일">
      <div>
        <p className={styles.eyebrow}>A PLACE FOR YOUR QUESTIONS</p>
        <h2>묻고, 살피고,<br className={styles.mobileBreak} /> 함께 걸어갑니다.</h2>
        <p>믿음의 물음부터 교회에서 받은 상처까지.<br />질문을 꺼내고, 성경과 삶을 살피며, 다음 대화를 준비하는 자리입니다.</p>
      </div>
      <nav aria-label="질문하는 교회 페이지 안내">
        <a href="#questions-introduction"><span>01</span> 우리의 고백</a>
        <a href="#questions-guide"><span>02</span> 내 질문 찾아보기</a>
        <a href="#question-conversation"><span>03</span> 대화 준비하기</a>
        <a href="#study-content"><span>04</span> 12과 성경공부</a>
      </nav>
    </aside>
  );
}

export function WayQuestionsGuide() {
  const [category, setCategory] = useState<QuestionCategory | "전체">("전체");
  const [question, setQuestion] = useState("");
  const [situation, setSituation] = useState("");
  const [need, setNeed] = useState("먼저 제 이야기를 들어 주세요.");
  const [copyStatus, setCopyStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const visibleQuestions = category === "전체" ? churchQuestions : churchQuestions.filter((item) => item.category === category);
  const conversation = [
    "함께 나누고 싶은 질문", question.trim(),
    situation.trim() ? `\n이 질문이 생긴 상황\n${situation.trim()}` : "",
    `\n바라는 대화\n${need}`
  ].filter(Boolean).join("\n");

  function prepareQuestion(value: string) {
    setQuestion(value);
    setCopyStatus("선택한 질문을 아래 대화 메모에 담았습니다.");
    setManualCopy(false);
    questionRef.current?.focus();
  }

  function resetCopyStatus() {
    setCopyStatus("");
    setManualCopy(false);
  }

  async function copyConversation() {
    if (!question.trim()) return;
    try {
      await navigator.clipboard.writeText(conversation);
      setCopyStatus("대화문을 복사했습니다. 원하는 곳에 직접 붙여 넣어 사용하세요.");
      setManualCopy(false);
    } catch {
      setManualCopy(true);
      setCopyStatus("자동 복사가 어려운 환경입니다. 아래 대화문을 선택해 직접 복사해 주세요.");
    }
  }

  return (
    <div className={styles.guide}>
      <section id="questions-guide" className={styles.explorer} aria-labelledby="questions-title">
        <div className={styles.inner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>QUESTIONS WE CAN BRING</p>
            <h2 id="questions-title">이런 질문,<br /><em>꺼내도 괜찮을까요?</em></h2>
            <p>사소해 보이는 질문에도 한 사람의 삶이 담겨 있습니다.<br />지금 내 마음에 가까운 물음부터 펼쳐 보세요.</p>
          </header>
          <div className={styles.filter} role="group" aria-label="질문 주제 선택">
            {(["전체", ...questionCategories] as const).map((item) => (
              <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <p className={styles.questionCount} role="status">{category} · {visibleQuestions.length}개의 질문</p>
          <div className={styles.questionList}>
            {visibleQuestions.map((item) => (
              <details key={item.id} className={styles.question}>
                <summary>
                  <span className={styles.questionNumber}>{String(churchQuestions.indexOf(item) + 1).padStart(2, "0")}</span>
                  <span><small>{item.category}</small><strong>{item.question}</strong></span>
                  <span className={styles.expandIcon} aria-hidden="true" />
                </summary>
                <div className={styles.answer}>
                  <div className={styles.firstResponse}><h3>먼저 나누고 싶은 말</h3><p>{item.response}</p></div>
                  <div className={styles.scripture}><h3>함께 살필 말씀</h3><strong>{item.scripture}</strong><p>{item.context}</p></div>
                  <div className={styles.invitation}><h3>대화를 여는 질문</h3><p>{item.invitation}</p></div>
                  <button type="button" className={styles.textButton} onClick={() => prepareQuestion(item.question)}>이 질문으로 대화 준비하기 <span aria-hidden="true">↗</span></button>
                </div>
              </details>
            ))}
          </div>
          <p className={styles.editorialNote}>연구를 참고해 구성한 질문 예시이며, 조사 참여자의 말을 인용한 것은 아닙니다. 안내는 함께 탐구하기 위한 출발점입니다. 구체적인 상황을 듣고, 성경을 문맥 안에서 살피며 대화를 이어 갑니다.</p>
        </div>
      </section>

      <section className={styles.covenant} aria-labelledby="conversation-promise">
        <div className={styles.inner}>
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>HOW WE LISTEN</p>
            <h2 id="conversation-promise">질문하는 용기 곁에,<br />들어 주는 책임이 있습니다.</h2>
            <p>열린 질문은 청년의 용기만으로 자라지 않습니다.<br />교회도 듣는 방식과 함께 살아가는 모습을 돌아봐야 합니다.</p>
          </header>
          <ol className={styles.promises}>
            <li><span>01</span><h3>판단을 서두르지 않습니다.</h3><p>정답을 말하기 전에 질문이 생긴 이야기를 듣습니다. 비웃거나 공개적인 고백을 강요하지 않고, 말하고 싶은 범위를 존중합니다.</p></li>
            <li><span>02</span><h3>말씀과 관행을 구분합니다.</h3><p>성경의 가르침, 우리의 해석, 익숙한 관행을 구분해 살핍니다. 지도자도 모르는 것을 인정하고 함께 확인합니다.</p></li>
            <li><span>03</span><h3>교회가 바꿀 것도 찾습니다.</h3><p>봉사의 부담, 닫힌 관계, 설명이 부족한 결정은 공동체가 돌아볼 문제입니다. 질문한 사람에게만 변화를 요구하지 않습니다.</p></li>
            <li><span>04</span><h3>다음 걸음을 함께 정합니다.</h3><p>한 번에 답이 나지 않아도 질문을 지우지 않습니다. 더 읽을 말씀, 필요한 도움, 다시 만날 때를 서로 의논합니다.</p></li>
          </ol>
        </div>
      </section>

      <section id="question-conversation" className={styles.conversation} aria-labelledby="conversation-title">
        <div className={styles.inner}>
          <div className={styles.conversationGrid}>
            <header className={styles.sectionHeader}>
              <p className={styles.eyebrow}>YOUR NEXT CONVERSATION</p>
              <h2 id="conversation-title">말을 꺼내기 어렵다면,<br /><em>한 문장부터.</em></h2>
              <p>답을 잘 정리해서 올 필요는 없습니다.<br />무엇이 궁금한지, 어떤 대화를 바라는지<br />내 말로 적어 보세요.</p>
              <blockquote>“이 질문을 해도 되는지<br />망설였는데, 함께 이야기하고 싶어요.”</blockquote>
              <p className={styles.privateNote}>이 메모는 자동 저장되거나 교회로 전송되지 않습니다. 새로고침하거나 페이지를 떠나기 전에 복사해 두세요.</p>
            </header>
            <div className={styles.memo}>
              <label htmlFor="conversation-question">지금 묻고 싶은 질문 <small>필수</small></label>
              <textarea id="conversation-question" ref={questionRef} rows={3} value={question} maxLength={2000} placeholder="제가 정말 묻고 싶은 것은…" onChange={(event) => { setQuestion(event.target.value); resetCopyStatus(); }} />
              <label htmlFor="conversation-situation">이 질문이 생긴 상황 <small>선택</small></label>
              <textarea id="conversation-situation" rows={3} value={situation} maxLength={4000} placeholder="말하고 싶은 만큼만 적어 주세요." onChange={(event) => { setSituation(event.target.value); resetCopyStatus(); }} />
              <label htmlFor="conversation-need">이런 대화를 바라요</label>
              <select id="conversation-need" value={need} onChange={(event) => { setNeed(event.target.value); resetCopyStatus(); }}>
                <option>먼저 제 이야기를 들어 주세요.</option>
                <option>성경을 함께 살피고 싶어요.</option>
                <option>이유를 설명 듣고, 필요한 변화를 함께 논의하고 싶어요.</option>
                <option>아직 무엇이 필요한지 함께 찾아보고 싶어요.</option>
              </select>
              <button type="button" className={styles.primaryButton} disabled={!question.trim()} onClick={copyConversation}>대화문 복사하기 <span aria-hidden="true">↗</span></button>
              <p className={styles.copyStatus} role="status">{copyStatus}</p>
              {manualCopy && <label className={styles.manualCopy}>직접 복사할 대화문<textarea readOnly rows={8} value={conversation} onFocus={(event) => event.target.select()} /></label>}
              <div className={styles.nextSteps}>
                <Link href="/services/counseling">개별 대화를 원하면 상담 요청으로 <span aria-hidden="true">→</span></Link>
                <p>기존 상담 요청 페이지로 이동합니다. 이름과 연락처를 입력하는 별도 절차이며, 이 메모는 자동으로 전달되지 않습니다.</p>
                <a href="#study-content">말씀으로 더 살펴보려면 12과 성경공부로 <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.research} aria-labelledby="research-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>WHY THESE QUESTIONS</p>
          <h2 id="research-title">떠나는 이유를 듣는 일도, 교회의 몫입니다.</h2>
          <p>국내 조사와 연구는 신앙의 고민뿐 아니라 생활과 헌신의 부담, 권위적인 소통, 관계의 소외를 함께 살펴야 함을 보여 줍니다. 그래서 이 페이지는 개인의 믿음을 묻는 질문과 교회가 자신을 돌아보는 질문을 함께 담았습니다.</p>
          <details className={styles.sources}>
            <summary>기획에 참고한 조사와 연구 <span>4개 자료 · 범위와 한계 보기</span></summary>
            <ol>{questionResearch.map((source) => (
              <li key={source.url}>
                <small>{source.year}</small>
                <h3><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span aria-hidden="true">↗</span></a></h3>
                <p className={styles.sourceAuthor}>{source.author}</p>
                <p>{source.note}</p><p>{source.takeaway}</p>
              </li>
            ))}</ol>
            <p className={styles.sourceDate}>자료 확인: 2026년 11월 1일. 질문과 첫 안내는 위 자료의 결론을 그대로 옮긴 것이 아니라, 임마누엘의 신앙 고백 안에서 대화하도록 구성한 편집 예시입니다.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
