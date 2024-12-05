class Api::V1::SupervisorsController < ApplicationController
  before_action :authorize_request, only: [:create, :update, :destroy]
  before_action :set_supervisor, only: [:show, :update, :destroy]

  # GET /api/v1/supervisors
  def index
    @supervisors = Supervisor.all
    render json: @supervisors
  end

  # GET /api/v1/supervisors/:id
  def show
    render json: @supervisor
  end

  # POST /api/v1/supervisors
  def create
    @supervisor = Supervisor.new(supervisor_params)
    if @supervisor.save
      render json: @supervisor, status: :created
    else
      render json: { errors: @supervisor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/supervisors/:id
  def update
    if @supervisor.update(supervisor_params)
      render json: @supervisor
    else
      render json: { errors: @supervisor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/supervisors/:id
  def destroy
    @supervisor.destroy
    head :no_content
  end

  private

  def set_supervisor
    @supervisor = Supervisor.find(params[:id])
  end

  def supervisor_params
    params.require(:supervisor).permit(:name)
  end
end
