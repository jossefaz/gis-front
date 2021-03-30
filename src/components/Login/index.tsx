import { useState } from "react";
import { useActions } from "../../hooks/useActions";
import { useForm } from "react-hook-form";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
import { getCredentials } from "../../core/HTTP/auth";
import { UserCredentials } from "../../core/types";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { setToken } = useActions();
  const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  const { jwt } = useTypedSelector((state) => state.auth);
  const [errorCredentials, seterrorCredentials] = useState(false);

  const getAndSetToken = async (data: UserCredentials) => {
    const token = await getCredentials(data);
    token ? setToken(token) : seterrorCredentials(true);
  };

  return (
    <div className="ui middle aligned center aligned grid">
      <div className="column">
        <h2 className="ui teal image header">
          <img src="assets/images/logo.png" className="image" />
          <div className="content">Log-in to your account</div>
        </h2>
        <form className="ui large form" onSubmit={handleSubmit(getAndSetToken)}>
          <div className="ui stacked segment">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input
                  type="text"
                  name="email"
                  placeholder="E-mail address"
                  ref={register({ required: true })}
                />
                {errors.email && <span>You must enter user email</span>}
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  ref={register({ required: true })}
                />
                {errors.password && <span>You must enter password</span>}
              </div>
            </div>
            <input
              className="ui fluid large teal submit button"
              type="submit"
              value="Login"
            />
          </div>
        </form>
        {errorCredentials && <span>Not Valid credentials</span>}
      </div>
    </div>
  );
};

export default LoginForm;
