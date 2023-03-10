import Header from "../../component/common/header";
import {useLocation, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {useEffect, useState} from "react";
import queryString from "query-string";
import axios from "axios";

const AuthPage = () => {

    useEffect(() => {
            checkIsRedirected()
            get2LeggedToken()
            get3LeggedToken()
        },[]
        )

    const navigate = useNavigate();
    const location = useLocation()
    const qCode = useLocation().search;
    const authCode = queryString.parse(qCode).code

    const [redirected, setRedirected] = useState(false)
    const [cntrToken, setCntrToken] = useState()
    const [depositToken, setDepositToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [userSeqNo, setUserSeqNo] = useState()
    const [clientUseCode, setClientUseCode] = useState()

    const get3LeggedToken = () => {
        if (redirected) {
            const httpRequest = {
                method: "POST",
                url: `${process.env.REACT_APP_PROXY}/auth/callback?code=${authCode}`,
            }
            axios(httpRequest)
                .then((res) => {
                    setCntrToken(res.data.access_token)
                    setRefreshToken(res.data.refresh_token)
                    setUserSeqNo((res.data.user_seq_no))
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const get2LeggedToken = () => {
        if (redirected) {
            const httpRequest = {
                method: "POST",
                url: `${process.env.REACT_APP_PROXY}/auth/`,
            }
            axios(httpRequest)
                .then((res) => {
                    setDepositToken(prev => res.data?.access_token || prev)
                    setClientUseCode(res.data.client_use_code)
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const setInfo = () => {
        const httpRequest = {
            method: "POST",
            url: `${process.env.REACT_APP_PROXY}/auth/token`,
            headers: {
                Authorization: localStorage.getItem("Authorization")
            },
            data: {
                cntrToken: cntrToken,
                refreshToken: refreshToken,
                depositToken: depositToken,
                userSeqNo: userSeqNo,
                clientUseCode: clientUseCode
            }
        }
        console.log(httpRequest)
        axios(httpRequest)
            .then((res) => {
                console.log(res.data.code)
                navigate("/info")
            }).catch((err) => {
            console.log(err)
        })
    }

    const authHandleClick = () => {
        let tmpWindow = window.open("about:blank")
        const clientId = process.env.REACT_APP_CLIENTID
        const redirect_uri = process.env.REACT_APP_REDIRECT_URI
        const scope = process.env.REACT_APP_SCOPE
        const state = process.env.REACT_APP_STATE
        const auth_type = process.env.REACT_APP_AUTH_TYPE
        tmpWindow.location.href = `${process.env.REACT_APP_TEST_API_URL}?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&auth_type=${auth_type}`
    };

    const checkIsRedirected = () => {
        if (location.search[0]==='?')
            setRedirected(true)
    }

    const logoutHandleClick = () => {
        localStorage.clear()
        window.alert("???????????? ???????????????")
    }

    const pageHandleClick = () => {
        navigate("/info")
    }
    return (
        <div>
            <Header/>
                {redirected ?
                    <Root>
                        <Text>????????? ?????? ??? ???????????? ???????????????</Text>
                        <SubmitButton onClick={setInfo}>??????</SubmitButton>
                    </Root>
                    :
                    <Root>
                        <P>?????? ?????? ??? ???????????? ??? ????????????.</P>
                        <AuthButton onClick={authHandleClick}>??????????????????</AuthButton>
                        <LogoutButton onClick={logoutHandleClick}>????????????</LogoutButton>
                        <PageButton onClick={pageHandleClick}>??????????????????</PageButton>
                    </Root>
                }
        </div>
    )
}
export default AuthPage;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`
const Text = styled.div`
  margin: 50px;
  text-align: center;
`

const SubmitButton = styled.button`
  justify-content: center;
  margin: auto;
  width: 300px;
  height: 40px;
  background: dodgerblue;
  color: white;
  border: none;
`;
const P = styled.p`
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`
const AuthButton = styled.button`
  justify-content: center;
  margin: auto;
  width: 300px;
  height: 40px;
  background: orange;
  color: white;
  border: none;
`;

const LogoutButton = styled.button`
  justify-content: center;
  margin: auto;
  width: 300px;
  height: 40px;
  background: dodgerblue;
  color: white;
  border: none;
`;

const PageButton = styled.button`
  justify-content: center;
  margin: auto;
  width: 300px;
  height: 40px;
  background: #4C489D;
  color: white;
  border: none;
`;