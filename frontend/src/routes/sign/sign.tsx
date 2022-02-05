import React from 'react'
import { Paths } from '../router-config'
import { Route, Switch } from 'react-router-dom'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { FormGroup } from '../../components/form-group'
import { useForm } from 'react-hook-form'

interface FormFields {
  message: string
}

const submit = () => {
  throw new Error('Build this')
}

export const Sign = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  return (
    <Switch>
      <Route path={Paths.Sign} exact={true}>
        <>
          <Header style={{ marginTop: 0 }}>Sign</Header>
          <form onSubmit={handleSubmit(submit)}>
            <FormGroup
              label='Message'
              labelFor='message'
              helperText={errors.message?.message}
            >
              <textarea
                {...register('message', { required: 'Required' })}
              ></textarea>
            </FormGroup>
            <Button type='submit'>Sign</Button>
          </form>
          <form>
            <textarea
              disabled={true}
              style={{
                marginTop: 4,
                marginBottom: 4
              }}
            ></textarea>
            <Button
              style={{
                marginTop: 4,
                marginBottom: 4
              }}
            >
              Send
            </Button>
          </form>
        </>
      </Route>
    </Switch>
  )
}
