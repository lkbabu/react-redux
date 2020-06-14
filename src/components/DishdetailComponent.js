import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label,Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';



const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);


class CommentForm extends Component {


  constructor(props) {

    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
    this.state = {

      isModalOpen: false
    }
  }

  toggleModal() {
    this.setState({

      isModalOpen: !this.state.isModalOpen
    })

  }
  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);

}

  render() {
    return (
     <React.Fragment>
        <Button outline onClick={this.toggleModal}><span className='fa fa-pencil fa-lg'></span> Submit Comment</Button>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                 <FormGroup>
                                <Label htmlFor="rating">Rating</Label>
                                
                                <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        
                                    </Control.select>
                                     
                                
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="author" >Your Name</Label>
                               
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                           <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be 3 characters or more',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                              
                            </FormGroup>
                            <FormGroup>
                            <Label htmlFor="comment">Comment</Label>
                              
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control" />
                            </FormGroup>
             
              <Button type="submit" value="submit" color="primary">Submit</Button>
            </LocalForm>

          </ModalBody>
        </Modal>

        </React.Fragment>


    )
  }


}


function RenderDish({ dish }) {



  return (
    <FadeTransform
    in
    transformProps={{
        exitTransform: 'scale(0.5) translateY(-50%)'
    }}>

    <Card>
      <CardImg top src={baseUrl+dish.image} alt={dish.name} />
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        <CardText>{dish.description}</CardText>
      </CardBody>
    </Card>
    </FadeTransform>

  );
}


function RenderComments({ comments ,postComment,dishId}) {

  

  const listComments = comments.map((comment) =>
    <div>

      <ul key={comment.id} className="list-unstyled">
      <Stagger in>
        <Fade in>
        <li>{comment.comment}</li>
         &nbsp;
         <li>-- {comment.author} , {new Intl.DateTimeFormat("default", {
            year: "numeric",
            day: "2-digit",
            month: "short"
          }).format(new Date(comment.date))}</li>
          </Fade>

    </Stagger>
      </ul>

    </div>


  );
  if (comments != null) {
    return (
      <div>
        <h4>Comments</h4>
        {listComments}
        <CommentForm dishId={dishId} postComment={postComment} />


      </div>
    );
  }
  else {
    return (<div></div>);
  }

}



const DishDetail = (props) => {
  if (props.isLoading) {
    return(
        <div className="container">
            <div className="row">            
                <Loading />
            </div>
        </div>
    );
}
else if (props.errMess) {
    return(
        <div className="container">
            <div className="row">            
                <h4>{props.errMess}</h4>
            </div>
        </div>
    );
}
  else if (props.dish != null)
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>

            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments comments={props.comments} postComment={props.postComment}
        dishId={props.dish.id} />
          </div>
        </div>
      </div>
    );
  else
    return (<div></div>);

}


export default DishDetail;