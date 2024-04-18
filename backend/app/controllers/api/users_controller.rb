class Api::UsersController < ApplicationController

  # GET /users/1
  def show

    user = User.find params[:id]

    render json: user

  end

  def show_by_email
    email = params[:email]
    email["&"] = "."
    email["start="] = ""
    email["end="] = ""
    user = User.find_by email: email
    render json: user
  end

  # POST /users
  def create
    # @user = User.new(user_params)

    # if @user.save
    #   redirect_to @user, notice: "User was successfully created."
    # else
    #   render :new, status: :unprocessable_entity
    # end
  end

  # PATCH/PUT /users/1
  def update
    # if @user.update(user_params)
    #   redirect_to @user, notice: "User was successfully updated.", status: :see_other
    # else
    #   render :edit, status: :unprocessable_entity
    # end
  end

  # DELETE /users/1
  def destroy
    user = User.find params[:id]
    user.destroy!
  end

  private
    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:username, :email, :password)
    end
end
