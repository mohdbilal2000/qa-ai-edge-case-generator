
import streamlit as st
import os
import pandas as pd
import google.generativeai as genai
from io import StringIO
import json

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="QA Edge Case Assistant",
    page_icon="🧪",
    layout="wide"
)

# --- SIDEBAR: CONFIGURATION ---
with st.sidebar:
    st.header("⚙️ Configuration")
    st.info("The system is pre-configured with the required API Key environment variable.")
    st.markdown("---")
    st.markdown(
        """
        **Developer:** Mohd Bilal | Senior QA Architect
        **Tool:** Automates negative, boundary, and security test scenarios.
        """
    )

# --- MAIN LAYOUT ---
st.title("🧪 QA Edge Case & Test Data Generator")
st.subheader("Automating the Unpredictable: Security & Boundary Testing")

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    feature_name = st.text_input(
        "Feature Name", 
        placeholder="e.g. Credit Card Payment Form",
        help="The specific feature you want to test."
    )

with col2:
    platform = st.selectbox(
        "Platform / Environment", 
        ["Web Application", "Mobile App (iOS/Android)", "REST API", "Database / SQL"]
    )

context = st.text_area(
    "Additional Context / Acceptance Criteria",
    placeholder="e.g. Max character limit is 50. Only accepts US currency.",
    height=100
)

# --- LOGIC ENGINE ---
if st.button("🚀 Generate Scenarios", type="primary"):
    api_key = os.environ.get('API_KEY')
    
    if not api_key:
        st.error("⚠️ System Halted: API_KEY environment variable is missing.")
        st.stop()
    
    if not feature_name:
        st.warning("⚠️ Please enter a Feature Name to test.")
        st.stop()

    # Configure Gemini
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash-exp') # Standard flash for speed in Python context

    system_prompt = """
    You are a Principal SDET and Security Researcher. 
    Your goal is to break software by finding edge cases, security vulnerabilities, and logic gaps.
    You do not write "happy path" tests. You write destructive tests.
    """

    user_prompt = f"""
    Generate a comprehensive test data table for the following feature:
    
    **Feature:** {feature_name}
    **Platform:** {platform}
    **Context:** {context}
    
    **Testing Requirements:**
    1. **Security:** Include SQL Injection, XSS, and Input Sanitization checks.
    2. **Boundary:** Test Minimum-1, Maximum+1, and Overflow values.
    3. **Data Types:** Test Mismatched types (Strings in Integer fields).
    4. **Localization:** Include Chinese/Arabic characters and Unicode/Emoji inputs.
    
    **Output Format:**
    Return ONLY a raw CSV string with headers: Category, Test Case Description, Test Data / Input, Expected Result.
    No conversational text, no markdown code blocks.
    """

    with st.spinner("🤖 AI Architect is analyzing requirements and generating edge cases..."):
        try:
            response = model.generate_content(
                user_prompt,
                generation_config=genai.types.GenerationConfig(
                    candidate_count=1,
                    temperature=0.7
                )
            )
            
            raw_csv = response.text.strip()
            
            # Basic cleanup if model includes markdown
            if "```" in raw_csv:
                raw_csv = raw_csv.replace("```csv", "").replace("```", "").strip()

            # Convert to DataFrame
            df = pd.read_csv(StringIO(raw_csv))
            
            st.success("✅ Analysis Complete. Scenarios Generated.")
            st.dataframe(df, use_container_width=True)
            
            csv_file = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="📥 Download Test Cases (CSV)",
                data=csv_file,
                file_name=f"qa_edge_cases_{feature_name.replace(' ', '_').lower()}.csv",
                mime="text/csv"
            )

        except Exception as e:
            st.error(f"❌ An error occurred: {e}")
